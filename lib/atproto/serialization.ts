import { BlobRefJSON, toBlobRef } from "@/server/routers/atproto/utils";
import { BlobRef } from "@atproto/api";
import { isObject } from "../isObject";

type ReplaceType<T, U, V> =
  // If T directly extends U, substitute to V
  T extends U ? V
  : // If T is an array, recursively apply ReplaceType on the element type
  T extends (infer Item)[] ? ReplaceType<Item, U, V>[]
  : // If T is an object, recursively apply ReplaceType on all properties
  T extends object ? { [K in keyof T]: ReplaceType<T[K], U, V> }
  : // Otherwise, keep original type
    T;

export type Serialize<T> = ReplaceType<T, BlobRef, BlobRefJSON>;

export const serialize = <T>(data: T): Serialize<T> => {
  return JSON.parse(JSON.stringify(data)) as Serialize<T>;
};

export const unserialize = <T>(data: Serialize<T>): T => {
  const isObj = isObject(data);
  if (!isObj) {
    if (Array.isArray(data)) {
      return data.map(unserialize) as T;
    }
    return data as T;
  }
  if ("$type" in data && data.$type === "blob" && "ref" in data) {
    try {
      return toBlobRef(data as unknown as BlobRefJSON) as T;
    } catch {
      return data as T;
    }
  }

  const obj = data as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, unserialize(value)])
  ) as T;
};
