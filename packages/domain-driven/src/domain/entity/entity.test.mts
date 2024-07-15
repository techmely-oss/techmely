import { describe, expect, it } from "vitest";
import { Result } from "../../utils";
import type { IResult } from "../../utils/result/types";
import { Entity } from "./index";

describe("entity", () => {
  describe("simple entity", () => {
    interface Props {
      id?: string;
      foo: string;
    }

    class EntitySample extends Entity<Props> {
      private constructor(props: Props) {
        super(props);
      }

      isValidProps(value: any): boolean {
        return value !== undefined;
      }

      static override create(props: Props): IResult<EntitySample> {
        return Result.Ok(new EntitySample(props));
      }
    }

    it("should get prototype", () => {
      const ent = EntitySample.create({ foo: "bar" });
      expect(ent.isOk()).toBeTruthy();
    });
  });
});
