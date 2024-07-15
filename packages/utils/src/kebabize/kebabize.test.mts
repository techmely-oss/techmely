import { describe, expect, test } from "vitest";
import { kebabize } from ".";

describe("Kebabize()", () => {
  test("should kebabize everythings", () => {
    const words = [
      "StackOverflow",
      "camelCase",
      "alllowercase",
      "ALLCAPITALLETTERS",
      "CustomXMLParser",
      "APIFinder",
      "JSONResponseData",
      "Person20Address",
      "UserAPI20Endpoint",
    ];
    const expectedResults = [
      "stack-overflow",
      "camel-case",
      "alllowercase",
      "allcapitalletters",
      "custom-xml-parser",
      "api-finder",
      "json-response-data",
      "person20-address",
      "user-api20-endpoint",
    ];
    expect(words.map(kebabize)).toStrictEqual(expectedResults);
  });
});
