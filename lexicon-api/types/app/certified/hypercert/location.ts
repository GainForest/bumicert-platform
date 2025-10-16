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
const id = 'app.certified.hypercert.location'

export interface Record {
  $type: 'app.certified.hypercert.location'
  /** Optional name for this location */
  name?: string
  /** Optional description for this location */
  description?: string
  /** Spatial Reference System: the coordinate system within which the object is positioned (e.g ESPG:4326) */
  srs?: string
  /** The location of where the work was performed */
  value: BlobRef
  createdAt: string
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
