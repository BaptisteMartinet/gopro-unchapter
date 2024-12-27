import { useState } from "react";

export type AsyncStatus<T> =
  | { status: "uninitialized" }
  | { status: "pending"; promise: Promise<T> }
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; error: Error };

export function useAsyncHandler<T, ArgsType extends Array<unknown>>(
  fn: (...args: ArgsType) => Promise<T>
) {
  const [status, setStatus] = useState<AsyncStatus<T>>({
    status: "uninitialized",
  });

  const run = (...args: ArgsType) => {
    const promise = fn(...args);
    setStatus({ status: "pending", promise });
    promise
      .then((value) => setStatus({ status: "fulfilled", value }))
      .catch((error) => setStatus({ status: "rejected", error }));
    return promise;
  };

  return [status, run] as const;
}
