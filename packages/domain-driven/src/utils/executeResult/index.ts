import type { CommandPort } from "../../domain/use-cases-port";
import type { Result } from "../result";
import type { ExecuteResult } from "./types";

export function executeResult<Req, Res>(
  command: CommandPort<Req | VoidFunction, Res>,
  result: Result,
): ExecuteResult<Req, Res> {
  return {
    on(option) {
      if (option === "Ok" && result.isOk()) return command.execute();
      if (option === "Fail" && result.isFail()) return command.execute();
      throw new Error("Option must be [Ok, Fail]");
    },
    withData(data) {
      return {
        on(option) {
          if (option === "Ok" && result.isOk()) return command.execute(data);
          if (option === "Fail" && result.isFail()) return command.execute(data);
          throw new Error("Option must be [Ok, Fail]");
        },
      };
    },
  };
}
