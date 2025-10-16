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
import type * as AppCertifiedHypercertRecord from './record.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'app.certified.hypercert.contribution'

export interface Record {
  $type: 'app.certified.hypercert.contribution'
  hypercert?: AppCertifiedHypercertRecord.Main
  /** Role or title of the contributor */
  role: string
  /** DID identifying the contributor */
  contributor: string
  /** What the contributor concretely did */
  description?: string
  /** When this contributor started */
  workTimeframeFrom?: string
  /** When this contributor finished */
  workTimeframeTo?: string
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
