export interface CommandPort<Req, Res> {
  execute(data?: Req): Res;
}

export type UseCase<Req, Res> = CommandPort<Req, Promise<Res>>;
