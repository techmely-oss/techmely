export class MutexLock {
  #mutex = Promise.resolve();

  lock(): PromiseLike<() => void> {
    let begin: (unlock: () => void) => void = () => {};
    this.#mutex = this.#mutex.then(() => new Promise(begin));

    return new Promise((res) => {
      begin = res;
    });
  }

  async dispatch<T>(fn: () => PromiseLike<T>): Promise<T> {
    const unlock = await this.lock();
    try {
      return await Promise.resolve(fn());
    } catch (error) {
      throw new Error("Dispatch failed!");
    } finally {
      unlock();
    }
  }
}
