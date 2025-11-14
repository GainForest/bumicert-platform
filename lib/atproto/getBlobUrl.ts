import { PDS_URL } from "@/config/atproto";
import { BlobRefJSON } from "@/server/routers/atproto/utils";
import { BlobRef } from "@atproto/api";

const getBlobUrl = (did: string, blobRef: BlobRef | BlobRefJSON) => {
  const ref = blobRef.ref as unknown as { $link?: string } | string;
  const cid = typeof ref === "string" ? ref : (ref?.$link ?? String(ref));
  const encodedCid = encodeURIComponent(cid);
  return `${PDS_URL}/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${encodedCid}`;
};

export default getBlobUrl;
