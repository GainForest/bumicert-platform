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

/** URI to external data */
export type Uri = string
/** Blob to external data (up to 10MB) */
export type SmallBlob = BlobRef
/** Blob to external data (up to 100MB) */
export type LargeBlob = BlobRef
/** Image blob (up to 5MB) */
export type SmallImage = BlobRef
/** Image blob (up to 10MB) */
export type LargeImage = BlobRef

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
