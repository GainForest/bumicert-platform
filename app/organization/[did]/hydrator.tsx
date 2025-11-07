"use client";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";
import { useOrganizationPageStore } from "./store";
import { useEffect } from "react";

export const OrganizationPageHydrator = ({
  initialSerializedData,
  initialDid,
  children,
}: {
  initialSerializedData: AppGainforestOrganizationInfo.Record | null;
  initialDid: string;
  children: React.ReactNode;
}) => {
  const setData = useOrganizationPageStore((state) => state.setData);
  const setDid = useOrganizationPageStore((state) => state.setDid);
  useEffect(() => {
    if (!initialSerializedData) return;
    setData(initialSerializedData);
    setDid(initialDid);
  }, [initialSerializedData, initialDid]);
  return children;
};
