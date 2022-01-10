import concurrentize from "../concurrentize";
import React, { useEffect, useState } from "react";

const global = window as any;

interface Message {
  error: any;
  data: any;
}

export const send = (channel: string, message: string): Promise<Message> => {
  if (!global[channel]) {
    throw new Error("Cannot send to this channel");
  }

  return concurrentize<Message>(() => {
    return new Promise((resolve) => {
      global[channel].receive((result: Message) => {
        resolve(result);
      });
      global[channel].send(message);
    });
  })
}

export function useSql<S>(query: string, deps?: React.DependencyList | undefined): { error: any, data: S } {
  const [data, setData] = useState<S>(null as any);
  const [error, setError] = useState(null);

  useEffect(() => {
    send("sql", query).then(result => {
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
      }
    });

  }, [query, deps?.values()]);

  return { error, data };
}
