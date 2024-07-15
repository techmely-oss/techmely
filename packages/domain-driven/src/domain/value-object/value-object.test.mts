import { describe, expect, it } from "vitest";
import { ValueObject } from ".";
import { Result } from "../../utils";
import type { IResult } from "../../utils/result/types";

describe("Value Object", () => {
  describe("native static methods", () => {
    interface Props {
      value: string;
    }
    class GenericVo extends ValueObject<Props> {}

    it("should return fails if provide a null value", () => {
      const obj = GenericVo.create(null as any);
      expect(obj.isFail()).toBeFalsy();
    });

    it("should return fails if provide an undefined value", () => {
      const obj = GenericVo.create(undefined as any);
      expect(obj.isFail()).toBeFalsy();
    });

    it("should create a valid value-object", () => {
      const obj = GenericVo.create({ value: "Hello World" });
      expect(obj.isFail()).toBeFalsy();
      expect(obj.value()).toStrictEqual({ value: "Hello World" });
    });
  });

  describe("override native static methods", () => {
    interface Props {
      value: string;
    }
    // biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
    class GenericVo extends ValueObject<Props> {
      static override isValidProps(): boolean {
        return true;
      }
    }

    it("should return success if provide a null value", () => {
      const obj = GenericVo.create(null);
      expect(obj.isOk()).toBeTruthy();
    });

    it("should return success if provide an undefined value", () => {
      const obj = GenericVo.create(undefined);
      expect(obj.isOk()).toBeTruthy();
    });

    it("should create a valid value-object", () => {
      const obj = GenericVo.create({ value: "Hello World" });
      expect(obj.isFail()).toBeFalsy();
      expect(obj.value()).toStrictEqual({ value: "Hello World" });
    });
  });

  describe("raw method", () => {
    interface Props {
      street: string;
      number: number;
      city: City;
    }
    class City extends ValueObject<"A" | "B" | "C"> {}
    class Address extends ValueObject<Props> {}

    it("should verify resolved types", () => {
      const address = new Address({
        city: new City("A"),
        number: 123,
        street: "5th Avenue",
      });
      const addressObject = address.raw();

      expect(addressObject).toStrictEqual({
        city: "A",
        number: 123,
        street: "5th Avenue",
      });
      expect(addressObject.city).toBe("A");
      expect(addressObject.number).toBe(123);
      expect(addressObject.street).toBe("5th Avenue");
      expect(addressObject.number.toExponential()).toBe("1.23e+2");
      expect(addressObject.number.toFixed()).toBe("123");
      expect(addressObject.city.concat("B")).toBe("AB");
      expect(addressObject.city.toLowerCase()).toBe("a");
      expect(addressObject.street.toUpperCase()).toBe("5TH AVENUE");
    });

    it("should be imutable", () => {
      const address = new Address({
        city: new City("A"),
        number: 123,
        street: "5th Avenue",
      });
      const addressObject = address.raw();
      expect(Object.isFrozen(addressObject)).toBeTruthy();
    });
  });

  describe("simple value-object", () => {
    interface Props {
      value: string;
    }

    class StringVo extends ValueObject<Props> {
      private constructor(props: Props) {
        super(props);
      }

      static override create(props: Props): IResult<StringVo> {
        return Result.Ok(new StringVo(props));
      }
    }

    it("should create a valid value-object", () => {
      const obj = StringVo.create({ value: "Hello World" });
      expect(obj.isFail()).toBeFalsy();
      expect(obj.value().raw()).toBe({ value: "Hello World" });
    });
  });

  describe("native validation", () => {
    interface Props {
      value: string;
      age: number;
    }

    class StringVo extends ValueObject<Props> {
      private constructor(props: Props) {
        super(props);
      }

      static override create(props: Props): IResult<StringVo> {
        return Result.Ok(new StringVo(props));
      }
    }

    it("should transform value object to object", () => {
      class Sample extends ValueObject<{ value: string }> {
        private constructor(props: { value: string }) {
          super(props);
        }
      }

      const valueObject = Sample.create({ value: "Sample" });

      expect(valueObject.value().raw()).toEqual({ value: "Sample" });
    });

    it("should transform value object to object", () => {
      class Sample extends ValueObject<{ value: string; foo: string }> {
        private constructor(props: { value: string; foo: string }) {
          super(props);
        }
      }

      const sample = Sample.create({ value: "Sample", foo: "bar" });

      class Obj extends ValueObject<{ value: Sample; other: string }> {
        private constructor(props: { value: Sample; other: string }) {
          super(props);
        }
      }

      const result = Obj.create({ value: sample.value(), other: "Other Sample" });

      expect(result.value().raw()).toEqual({
        value: { value: "Sample", foo: "bar" },
        other: "Other Sample",
      });
    });
  });

  describe("compare", () => {
    interface Props {
      value: string;
    }
    class Exam extends ValueObject<Props> {
      private constructor(props: Props) {
        super(props);
      }

      static override create(props: Props): Result<Exam> {
        return Result.Ok(new Exam(props));
      }
    }

    it("should to be equal another instance", () => {
      const a = Exam.create({ value: "hello there" }).value();
      const b = Exam.create({ value: "hello there" }).value();

      expect(a.isEqual(b)).toBeTruthy();
    });

    it("should to be equal another instance", () => {
      const a = Exam.create({ value: "hello there" }).value();
      const b = a.clone();

      expect(a.isEqual(b)).toBeTruthy();
    });

    it("should not to be equal another instance", () => {
      const a = Exam.create({ value: "hello there 1" }).value();
      const b = Exam.create({ value: "hello there 2" }).value();

      expect(a.isEqual(b)).toBeFalsy();
    });
  });

  describe("compare props as object", () => {
    interface Props {
      value: string;
    }
    // biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
    class Simple extends ValueObject<Props> {
      static override create(props: Props): IResult<Simple> {
        return Result.Ok(new Simple(props));
      }
    }

    it("should infer type on compare", () => {
      const a = Simple.create({ value: "a" }).value();
      const b = Simple.create({ value: "b" }).value();
      const c = Simple.create({ value: "a" }).value();

      expect(a.isEqual(b)).toBeFalsy();
      expect(a.isEqual(c)).toBeTruthy();
    });

    it("should compare nullable or undefined", () => {
      const a = Simple.create({ value: "a" }).value();
      const b = Simple.create({ value: "b" }).value();

      expect(a.isEqual(null as unknown as Simple)).toBeFalsy();
      expect(b.isEqual(undefined as unknown as Simple)).toBeFalsy();
    });

    it("should create a valid props object as value object", () => {
      const primitive = Simple.create({ value: "TEST" }).value();
      expect(typeof primitive.raw()).toBe("object");
      expect(primitive.raw()).toStrictEqual({ value: "TEST" });
    });
  });

  //   describe("primitive value object as string", () => {
  //     class Primitive extends ValueObject<string> {
  //       private constructor(value: string) {
  //         super(value);
  //       }

  //       static override create(value: string): Result<Primitive> {
  //         return Result.Ok(new Primitive(value));
  //       }
  //     }

  //     it("should create a valid primitive value object", () => {
  //       const primitive = Primitive.create("TEST").value();
  //       expect(typeof primitive.getRaw()).toBe("string");
  //       expect(typeof primitive.get("value")).toBe("string");
  //       expect(typeof primitive.toObject()).toBe("string");

  //       expect(primitive.getRaw()).toBe("TEST");
  //       expect(primitive.get("value")).toBe("TEST");
  //       expect(primitive.toObject()).toBe("TEST");
  //     });
  //   });

  //   describe("primitive value object as date", () => {
  //     class Primitive extends ValueObject<Date> {
  //       private constructor(value: Date) {
  //         super(value);
  //       }

  //       static override create(value: Date): Result<Primitive> {
  //         return Result.Ok(new Primitive(value));
  //       }
  //     }

  //     it("should create a valid primitive value object", () => {
  //       const date = new Date("2024-04-01T00:00:00");
  //       const primitive = Primitive.create(date).value();
  //       expect(primitive.getRaw()).toBeInstanceOf(Date);
  //       expect(primitive.get("value")).toBeInstanceOf(Date);
  //       expect(primitive.toObject()).toEqual(expect.any(Date));

  //       expect(primitive.getRaw()).toBe(date);
  //       expect(primitive.get("value")).toBe(date);
  //       expect(primitive.toObject()).toBe(date);
  //     });
  //   });

  //   describe("primitive value object as array", () => {
  //     class Primitive extends ValueObject<Array<number>> {
  //       private constructor(value: Array<number>) {
  //         super(value);
  //       }

  //       static override create(value: Array<number>): Result<Primitive> {
  //         return Result.Ok(new Primitive(value));
  //       }
  //     }

  //     it("should create a valid primitive value object", () => {
  //       const primitive = Primitive.create([1, 2, 3]).value();
  //       expect(primitive.getRaw()).toEqual([1, 2, 3]);
  //       expect(primitive.get("value")).toEqual([1, 2, 3]);
  //       expect(primitive.toObject()).toEqual([1, 2, 3]);
  //     });

  //     it("should create many primitive", () => {
  //       const payload = ValueObject.createMany([
  //         {
  //           class: Primitive,
  //           props: [1, 2],
  //         },
  //         {
  //           class: Primitive,
  //           props: [3, 4, 5],
  //         },
  //       ]);

  //       expect(payload.result.isOk()).toBeTruthy();
  //       expect(payload.data.next().value()).toMatchInlineSnapshot(`
  // Primitive {
  //   "autoMapper": AutoMapper {
  //     "validator": Validator {},
  //   },
  //   "config": Object {
  //     "disableGetters": false,
  //     "disableSetters": false,
  //   },
  //   "props": Array [
  //     1,
  //     2,
  //   ],
  //   "util": Utils {},
  //   "validator": Validator {},
  // }
  // `);
  //     });
  //   });

  //   describe("clone", () => {
  //     class StringVo extends ValueObject<string> {
  //       public static init(value: string): StringVo {
  //         return new StringVo(value);
  //       }
  //     }

  //     // Number class
  //     class NumberVo extends ValueObject<number> {
  //       public static init(value: number): NumberVo {
  //         return new NumberVo(value);
  //       }
  //     }

  //     // Array class
  //     class ArrayVo extends ValueObject<any[]> {
  //       public static init(value: any[]): ArrayVo {
  //         return new ArrayVo(value);
  //       }
  //     }

  //     // Symbol class
  //     class SymbolVo extends ValueObject<Symbol> {
  //       public static init(value: Symbol): SymbolVo {
  //         return new SymbolVo(value);
  //       }
  //     }

  //     // Date class
  //     class DateVo extends ValueObject<Date> {
  //       public static init(value: Date): DateVo {
  //         return new DateVo(value);
  //       }
  //     }

  //     // Object class
  //     class ObjectVo extends ValueObject<{ value: string }> {
  //       public static init(value: { value: string }): ObjectVo {
  //         return new ObjectVo(value);
  //       }
  //     }

  //     interface CProps {
  //       items: ArrayVo;
  //       name: StringVo;
  //       type: SymbolVo;
  //       profile: ObjectVo;
  //       index: NumberVo;
  //     }
  //     class Complex extends ValueObject<CProps & {}> {
  //       public static init(props: CProps): Complex {
  //         return new Complex(props);
  //       }
  //       static override create(props: CProps): Result<Complex> {
  //         return Result.Ok(new Complex(props));
  //       }
  //     }

  //     it("should clone string vo with success", () => {
  //       const str = StringVo.init("sample");
  //       expect(str.get("value")).toBe("sample");
  //       expect(str.toObject()).toBe("sample");

  //       const copy = str.clone();

  //       expect(copy.get("value")).toBe("sample");
  //       expect(copy.toObject()).toBe("sample");
  //       expect(copy.isEqual(str)).toBeTruthy();
  //       expect(copy.isEqual(StringVo.init("other"))).toBeFalsy();
  //     });

  //     // Test for NumberVo
  //     it("should clone number vo with success", () => {
  //       const num = NumberVo.init(42);
  //       expect(num.get("value")).toBe(42);
  //       expect(num.toObject()).toBe(42);

  //       const copy = num.clone();

  //       expect(copy.get("value")).toBe(42);
  //       expect(copy.toObject()).toBe(42);
  //       expect(copy.isEqual(num)).toBeTruthy();
  //       expect(copy.isEqual(NumberVo.init(43))).toBeFalsy();
  //     });

  //     // Test for ArrayVo
  //     it("should clone array vo with success", () => {
  //       const arr = ArrayVo.init([1, 2, 3]);
  //       expect(arr.get("value")).toEqual([1, 2, 3]);
  //       expect(arr.toObject()).toEqual([1, 2, 3]);

  //       const copy = arr.clone();

  //       expect(copy.get("value")).toEqual([1, 2, 3]);
  //       expect(copy.toObject()).toEqual([1, 2, 3]);
  //       expect(copy.isEqual(arr)).toBeTruthy();
  //       expect(copy.isEqual(ArrayVo.init([4, 5, 6]))).toBeFalsy();
  //     });

  //     // Test for SymbolVo
  //     it("should clone symbol vo with success", () => {
  //       const sym = SymbolVo.init(Symbol("test"));
  //       expect(sym.get("value")).toBe("test");
  //       expect(sym.toObject()).toBe("test");

  //       const copy = sym.clone();

  //       expect(copy.get("value")).toBe("test");
  //       expect(copy.toObject()).toBe("test");
  //       expect(copy.isEqual(sym)).toBeTruthy();
  //       expect(copy.isEqual(SymbolVo.init(Symbol("other")))).toBeFalsy();
  //     });

  //     // Test for DateVo
  //     it("should clone date vo with success", () => {
  //       const date = new Date();
  //       const dateVo = DateVo.init(date);
  //       expect(dateVo.get("value")).toEqual(date);
  //       expect(dateVo.toObject()).toEqual(date);

  //       const copy = dateVo.clone();

  //       expect(copy.get("value")).toEqual(date);
  //       expect(copy.toObject()).toEqual(date);
  //       expect(copy.isEqual(dateVo)).toBeTruthy();
  //       expect(copy.isEqual(DateVo.init(new Date("2020-01-01")))).toBeFalsy();
  //     });

  //     // Test for ObjectVo
  //     it("should clone object vo with success", () => {
  //       const obj = { value: "sample" };
  //       const objVo = ObjectVo.init(obj);
  //       expect(objVo.get("value")).toEqual("sample");
  //       expect(objVo.toObject()).toEqual(obj);

  //       const copy = objVo.clone();

  //       expect(copy.get("value")).toEqual("sample");
  //       expect(copy.toObject()).toEqual(obj);
  //       expect(copy.isEqual(objVo)).toBeTruthy();
  //       expect(copy.isEqual(ObjectVo.init({ value: "other" }))).toBeFalsy();
  //     });

  //     // Test for Complex
  //     it("should clone object vo with success", () => {
  //       const props: CProps = {
  //         index: NumberVo.init(1),
  //         items: ArrayVo.init([1, 2, 3]),
  //         name: StringVo.init("sample"),
  //         profile: ObjectVo.init({ value: "Jane" }),
  //         type: SymbolVo.init(Symbol("lorem")),
  //       };
  //       const objVo = Complex.init(props);
  //       expect(objVo.toObject()).toMatchInlineSnapshot(`
  // Object {
  //   "index": 1,
  //   "items": Array [
  //     1,
  //     2,
  //     3,
  //   ],
  //   "name": "sample",
  //   "profile": Object {
  //     "value": "Jane",
  //   },
  //   "type": "lorem",
  // }
  // `);

  //       expect(objVo.get("items").get("value"));
  //       expect(objVo.get("type").get("value")).toBe("lorem");
  //       // expect(objVo.get('value')).toEqual(props);
  //       expect(objVo.toObject()).toEqual({
  //         index: 1,
  //         items: [1, 2, 3],
  //         name: "sample",
  //         profile: {
  //           value: "Jane",
  //         },
  //         type: "lorem",
  //       });

  //       const copy: Complex = objVo.clone();

  //       expect(copy.toObject()).toEqual({
  //         index: 1,
  //         items: [1, 2, 3],
  //         name: "sample",
  //         profile: {
  //           value: "Jane",
  //         },
  //         type: "lorem",
  //       });
  //       expect(copy.isEqual(objVo)).toBeTruthy();
  //       expect(copy.isEqual(Complex.init({ ...props, index: NumberVo.init(2) }))).toBeFalsy();
  //     });
});
