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
const id = 'app.certified.hypercert.record'

export interface Evidence {
  $type?: 'app.certified.hypercert.record#evidence'
  /** Evidence resource URI */
  uri: string
  /** Optional title to describe the nature of the evidence */
  title?: string
}

const hashEvidence = 'evidence'

export function isEvidence<V>(v: V) {
  return is$typed(v, id, hashEvidence)
}

export function validateEvidence<V>(v: V) {
  return validate<Evidence & V>(v, id, hashEvidence)
}

export interface Record {
  $type: 'app.certified.hypercert.record'
  /** Title of the hypercert */
  title: string
  /** Identifier for the impact claim */
  hypercertID: string
  /** A description of the impact work done. */
  description: string
  /** Blob reference to hypercert image/visual representation. Maximum size is in bytes */
  image: BlobRef
  /** Scope of the work performed */
  workScope: string
  /** When the work began */
  workTimeframeFrom: string
  /** When the work ended */
  workTimeFrameTo: string
  /** Supporting evidence, documentation, or external data URIs */
  evidence?: Evidence[]
  /** DIDs identifying contributors to this hypercert */
  contributors?: string[]
  /** Rights keyword (as defined in app.certified.hypercert.rights) */
  rights?: string
  /** AT URI referencing a location record (app.certified.hypercert.location) */
  location?: string
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
