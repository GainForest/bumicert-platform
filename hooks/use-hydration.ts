"use client";

import { useEffect, useState } from "react";
import { isObject } from "@/lib/isObject";

/**
 * This hook is used to hydrate data from the initial data to the reactive data.
 * @param initialData - The initial data to initialize the state and the component with.
 * @param reactiveData - The reactive data that kicks in when the component is mounted.
 * @returns The hydrated data.
 */
const useHydratedData = <T>(
  initialData: T,
  reactiveData: T | null | undefined
) => {
  const [data, setData] = useState(initialData);
  useEffect(() => {
    if (reactiveData == null) return;
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setData((prev) =>
        isDeepEqual(prev, reactiveData) ? prev : reactiveData
      );
    }, 0);
  }, [reactiveData]);

  return data;
};

const isDeepEqual = (a: unknown, b: unknown): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export default useHydratedData;
