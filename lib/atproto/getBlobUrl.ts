import { PDS_URL } from "@/config/atproto";
import {
  LargeBlob,
  LargeImage,
  SmallBlob,
  SmallImage,
  Uri,
} from "@/lexicon-api/types/app/gainforest/common/defs";
import { $Typed } from "@/lexicon-api/util";
import { BlobRefGenerator } from "@/server/routers/atproto/utils";
import { BlobRef } from "@atproto/api";
import parseAtUri from "./getRkeyFromAtUri";

const getBlobUrl = (
  did: string,
  imageData:
    | string
    | BlobRef
    | BlobRefGenerator
    | $Typed<Uri | SmallImage | LargeImage | SmallBlob | LargeBlob>
    | Uri
    | SmallImage
    | LargeImage
    | SmallBlob
    | LargeBlob
) => {
  if (typeof imageData === "string") {
    const imageUrl = new URL(imageData);
    return imageUrl.toString();
  }

  const isBlobRef =
    imageData instanceof BlobRef ||
    ("ref" in imageData && "mimeType" in imageData && "size" in imageData);
  if (isBlobRef) {
    const ref = imageData.ref as unknown as { $link?: string } | string;
    const cid = typeof ref === "string" ? ref : (ref?.$link ?? String(ref));
    const encodedCid = encodeURIComponent(cid);
    return `${PDS_URL}/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${encodedCid}`;
  }

  // Handle $Typed cases
  if (imageData.$type === "app.gainforest.common.defs#uri") {
    const uri = imageData.uri;
    // TODO: handle other URI types
    // if (uri.startsWith("at://")) {
    //   const { did: uriDid, rkey: uriRkey } = parseAtUri(uri);
    //   return `${PDS_URL}/xrpc/com.atproto.repo.getRecord?did=${uriDid}&rkey=${uriRkey}`;
    // }
    return uri;
  }

  if (
    imageData.$type === "app.gainforest.common.defs#smallBlob" ||
    imageData.$type === "app.gainforest.common.defs#largeBlob"
  ) {
    const blob = imageData.blob;
    return getBlobUrl(did, blob);
  }

  if (
    imageData.$type === "app.gainforest.common.defs#smallImage" ||
    imageData.$type === "app.gainforest.common.defs#largeImage"
  ) {
    const image = imageData.image;
    return getBlobUrl(did, image);
  }

  if ("blob" in imageData) {
    const blob = imageData.blob;
    return getBlobUrl(did, blob);
  }

  if ("image" in imageData) {
    const image = imageData.image;
    return getBlobUrl(did, image);
  }

  if ("uri" in imageData) {
    const uri = imageData.uri;
    return uri;
  }

  // Line for compile time check that all cases are handled. THIS SHOULD NEVER BE REACHED.
  const imageDataTypeCheck = imageData satisfies never;
  return imageDataTypeCheck;
};

export default getBlobUrl;
