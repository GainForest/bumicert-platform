/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from '../../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'app.gainforest.common.defs'

/** Object containing a URI to external data */
export interface Uri {
  $type?: 'app.gainforest.common.defs#uri'
  /** URI to external data */
  uri: string
}

const hashUri = 'uri'

export function isUri<V>(v: V) {
  return is$typed(v, id, hashUri)
}

export function validateUri<V>(v: V) {
  return validate<Uri & V>(v, id, hashUri)
}

/** Object containing a blob to external data */
export interface SmallBlob {
  $type?: 'app.gainforest.common.defs#smallBlob'
  /** Blob to external data (up to 10MB) */
  blob: BlobRef
}

const hashSmallBlob = 'smallBlob'

export function isSmallBlob<V>(v: V) {
  return is$typed(v, id, hashSmallBlob)
}

export function validateSmallBlob<V>(v: V) {
  return validate<SmallBlob & V>(v, id, hashSmallBlob)
}

/** Object containing a blob to external data */
export interface LargeBlob {
  $type?: 'app.gainforest.common.defs#largeBlob'
  /** Blob to external data (up to 100MB) */
  blob: BlobRef
}

const hashLargeBlob = 'largeBlob'

export function isLargeBlob<V>(v: V) {
  return is$typed(v, id, hashLargeBlob)
}

export function validateLargeBlob<V>(v: V) {
  return validate<LargeBlob & V>(v, id, hashLargeBlob)
}

/** Object containing a small image */
export interface SmallImage {
  $type?: 'app.gainforest.common.defs#smallImage'
  /** Image (up to 5MB) */
  image: BlobRef
}

const hashSmallImage = 'smallImage'

export function isSmallImage<V>(v: V) {
  return is$typed(v, id, hashSmallImage)
}

export function validateSmallImage<V>(v: V) {
  return validate<SmallImage & V>(v, id, hashSmallImage)
}

/** Object containing a large image */
export interface LargeImage {
  $type?: 'app.gainforest.common.defs#largeImage'
  /** Image (up to 10MB) */
  image: BlobRef
}

const hashLargeImage = 'largeImage'

export function isLargeImage<V>(v: V) {
  return is$typed(v, id, hashLargeImage)
}

export function validateLargeImage<V>(v: V) {
  return validate<LargeImage & V>(v, id, hashLargeImage)
}

export interface IndexedOrganization {
  $type?: 'app.gainforest.common.defs#indexedOrganization'
  /** The URI of the organization */
  id: string
  /** The name of the organization */
  name: string
}

const hashIndexedOrganization = 'indexedOrganization'

export function isIndexedOrganization<V>(v: V) {
  return is$typed(v, id, hashIndexedOrganization)
}

export function validateIndexedOrganization<V>(v: V) {
  return validate<IndexedOrganization & V>(v, id, hashIndexedOrganization)
}
