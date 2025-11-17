// utils/transformer.ts
import type { DataTransformer } from "@trpc/server";
import {
  deserialize as deserializeAtproto,
  serialize as serializeAtproto,
} from "@/lib/atproto/serialization";
import superjson, { SuperJSONResult } from "superjson";
import { Serialize } from "@/lib/atproto/serialization";

export const customTransformer: DataTransformer = {
  serialize: (object) => {
    // typeof object = object
    // This logic runs for transforming the query or mutation parameters before they are sent to the server.
    // Conversion of object to string is automatically handled by TRPC.
    const atprotoSerialized = serializeAtproto(object);
    const serializedObject = superjson.serialize(atprotoSerialized);
    return serializedObject;
  },
  deserialize: <T>(object: SuperJSONResult): T => {
    // typeof object = { json: object }
    // This logic runs for transforming the query or mutation response before it is received by the client.
    // The received response is automatically converted from stringified JSON to object by TRPC.
    const superjsonDeserialized = superjson.deserialize(object) as Serialize<T>;
    const deserializedObject = deserializeAtproto(superjsonDeserialized);
    // console.log("deserialized object", deserializedObject);
    return deserializedObject as T;
  },
};

export type SerializedSuperjson<T> = Omit<SuperJSONResult, "json"> & {
  json: T;
};

export const serialize = <T>(data: T) => {
  const result = customTransformer.serialize(data);
  return result as SerializedSuperjson<T>;
};

export const deserialize = <T>(object: SerializedSuperjson<T>): T => {
  return customTransformer.deserialize(object);
};
