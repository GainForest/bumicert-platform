import { GainforestSDK } from "gainforest-sdk";
import { allowedPDSDomains } from "./gainforest-sdk";

export const gainforestSdk = new GainforestSDK(allowedPDSDomains);
