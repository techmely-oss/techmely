/**
 * Runs a function in a separate thread by using a Web Worker, allowing long running functions to not block the UI.
 * We create a Worker using a Blob object URL, the contents of which should be the stringified version of the supplied function.
 * Immediately post the return value of calling the function back
 * @returns a Promise, listening for onmessage and onerror events and resolving the data posted back from the worker, or throwing an error.
 */
export const runAsync = (fn: () => void) => {
  const worker = new Worker(URL.createObjectURL(new Blob([`postMessage((${fn})());`])));

  return new Promise((res, rej) => {
    worker.onmessage = ({ data }) => {
      res(data);
      worker.terminate();
    };
    worker.onerror = (err) => {
      rej(err);
      worker.terminate();
    };
  });
};
