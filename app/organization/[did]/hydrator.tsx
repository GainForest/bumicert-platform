"use client";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { useOrganizationPageStore } from "./store";
import { useEffect } from "react";
import { deserialize, SerializedSuperjson } from "@/server/utils/transformer";

export const OrganizationPageHydrator = ({
  initialSerializedData,
  initialDid,
  children,
}: {
  initialSerializedData: SerializedSuperjson<AppGainforestOrganizationInfo.Record> | null;
  initialDid: string;
  children: React.ReactNode;
}) => {
  const setData = useOrganizationPageStore((state) => state.setData);
  const setDid = useOrganizationPageStore((state) => state.setDid);
  useEffect(() => {
    if (!initialSerializedData) return;
    setData(deserialize(initialSerializedData));
    setDid(initialDid);
  }, [initialSerializedData, initialDid]);
  return children;
};
