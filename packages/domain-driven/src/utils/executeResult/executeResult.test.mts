import { describe, expect, it } from "vitest";
import { executeResult } from ".";
import type { CommandPort } from "../../domain/use-cases-port";
import { Result } from "../result";

class CreateUserCommand implements CommandPort<string, string> {
  execute(data?: string | undefined): string {
    return data || "Default data";
  }
}

describe("Execute results", () => {
  it("Should execute create user fail", () => {
    const result = Result.fail("Fail");
    const userCommand = executeResult(new CreateUserCommand(), result).on("Fail");
    const userCommandWithData = executeResult(new CreateUserCommand(), result)
      .withData("This is new command")
      .on("Fail");
    expect(userCommand).toBe("Default data");
    expect(userCommandWithData).toBe("This is new command");
  });
});
