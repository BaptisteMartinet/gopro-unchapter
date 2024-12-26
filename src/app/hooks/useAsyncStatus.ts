import { useState } from "react";

type AsyncStatus = "uninitialized" | "pending" | "fulfilled" | "rejected";

export function useAsyncStatus() {
  const [status, setStatus] = useState<AsyncStatus>("uninitialized");

  const track = (promise: Promise<unknown>) => {
    setStatus("pending");
    promise
      .then(() => setStatus("fulfilled"))
      .catch(() => setStatus("rejected"));
  };

  return [status, track] as const;
}
