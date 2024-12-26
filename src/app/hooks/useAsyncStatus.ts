import { useState } from "react";

export type AsyncStatus<T> =
  | { status: "uninitialized" }
  | { status: "pending" }
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; error: Error };

export function useAsyncStatus<T>() {
  const [status, setStatus] = useState<AsyncStatus<T>>({
    status: "uninitialized",
  });

  const track = (promise: Promise<T>) => {
    setStatus({ status: "pending" });
    promise
      .then((res) => setStatus({ status: "fulfilled", value: res }))
      .catch((err) => setStatus({ status: "rejected", error: err }));
  };

  return [status, track] as const;
}
