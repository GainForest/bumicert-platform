"use client";

import { useEffect, useState } from "react";

/**
 * This hook is used to hydrate data from the initial data to the reactive data.
 * @param initialData - The initial data to initialize the state and the component with.
 * @param reactiveData - The reactive data that kicks in when the component is mounted.
 * @returns The hydrated data.
 */
const useHydratedData = <T>(initialData: T, reactiveData: T | null) => {
  const [data, setData] = useState(initialData);
  useEffect(() => {
    if (reactiveData === null) return;
    setData(reactiveData);
  }, [reactiveData]);

  return data;
};

export default useHydratedData;
