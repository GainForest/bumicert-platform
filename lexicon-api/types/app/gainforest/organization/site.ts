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
import type * as AppGainforestCommonDefs from '../common/defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'app.gainforest.organization.site'

export interface Record {
  $type: 'app.gainforest.organization.site'
  /** The name of the site */
  name: string
  /** The latitude of the centerpoint of the site */
  lat: string
  /** The longitude of the centerpoint of the site */
  lon: string
  /** The area of the site in hectares */
  area: string
  shapefile?:
    | $Typed<AppGainforestCommonDefs.Uri>
    | $Typed<AppGainforestCommonDefs.SmallBlob>
    | { $type: string }
  trees?:
    | $Typed<AppGainforestCommonDefs.Uri>
    | $Typed<AppGainforestCommonDefs.SmallBlob>
    | { $type: string }
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
