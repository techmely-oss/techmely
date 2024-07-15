export type ExecuteResultOption = "Ok" | "Fail";

export type ResultHook<Res> = {
  on(options: ExecuteResultOption): Res;
};

export type ExecuteResult<Req, Res> = {
  withData(data: Req): ResultHook<Res>;
} & ResultHook<Res>;
