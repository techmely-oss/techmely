import { number, object, safeParse } from "valibot";
type CfMemory = {
  current: number;
  alarmScheduled?: number;
};

const requestSchema = object({
  reset: number(),
});

export class CfDoRateLimiter {
  #state: DurableObjectState;
  #memory: CfMemory;
  #storageKey = "rl";

  constructor(state: DurableObjectState) {
    this.#state = state;
    this.#state.blockConcurrencyWhile(async () => {
      const m = await this.#state.storage.get<CfMemory>(this.#storageKey);
      if (m) this.#memory = m;
    });
    this.#memory ??= {
      current: 0,
    };
  }

  async fetch(request: Request) {
    const reqValue = await request.json();
    const req = safeParse(requestSchema, reqValue);
    if (!req.success) {
      console.log("Invalid DO req", req.issues[0].message);
      return Response.json({ current: 0 });
    }

    this.#memory.current += 1;
    if (!this.#memory.alarmScheduled) {
      this.#memory.alarmScheduled = req.output.reset;
      await this.#state.storage.setAlarm(this.#memory.alarmScheduled);
    }
    await this.#state.storage.put(this.#storageKey, this.#memory);

    return Response.json({
      current: this.#memory.current,
    });
  }

  /**
   * alarm is called to clean up all state, which will remove the durable object from existence.
   */
  async alarm() {
    await this.#state.storage.deleteAll();
  }
}
