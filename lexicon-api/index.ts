import {
    ComAtprotoRepoListRecords,
    ComAtprotoRepoGetRecord,
    ComAtprotoRepoCreateRecord,
    ComAtprotoRepoPutRecord,
    ComAtprotoRepoDeleteRecord,
  } from "@atproto/api";
/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  XrpcClient,
  type FetchHandler,
  type FetchHandlerOptions,
} from '@atproto/xrpc'
import { schemas } from './lexicons'
import { CID } from 'multiformats/cid'
import { type OmitKey, type Un$Typed } from './util'
import * as AppCertifiedDefs from './types/app/certified/defs'
import * as AppCertifiedLocation from './types/app/certified/location'
import * as OrgHypercertsClaim from './types/org/hypercerts/claim'
import * as OrgHypercertsClaimContribution from './types/org/hypercerts/claim/contribution'
import * as OrgHypercertsClaimEvaluation from './types/org/hypercerts/claim/evaluation'
import * as OrgHypercertsClaimEvidence from './types/org/hypercerts/claim/evidence'
import * as OrgHypercertsClaimMeasurement from './types/org/hypercerts/claim/measurement'
import * as OrgHypercertsClaimRights from './types/org/hypercerts/claim/rights'
import * as AppGainforestCommonDefs from './types/app/gainforest/common/defs'
import * as AppGainforestOrganizationDefaultSite from './types/app/gainforest/organization/defaultSite'
import * as AppGainforestOrganizationGetIndexedOrganizations from './types/app/gainforest/organization/getIndexedOrganizations'
import * as AppGainforestOrganizationInfo from './types/app/gainforest/organization/info'
import * as AppGainforestOrganizationMeasuredTrees from './types/app/gainforest/organization/measuredTrees'
import * as AppGainforestOrganizationSite from './types/app/gainforest/organization/site'
import * as ComAtprotoRepoStrongRef from './types/com/atproto/repo/strongRef'

export * as AppCertifiedDefs from './types/app/certified/defs'
export * as AppCertifiedLocation from './types/app/certified/location'
export * as OrgHypercertsClaim from './types/org/hypercerts/claim'
export * as OrgHypercertsClaimContribution from './types/org/hypercerts/claim/contribution'
export * as OrgHypercertsClaimEvaluation from './types/org/hypercerts/claim/evaluation'
export * as OrgHypercertsClaimEvidence from './types/org/hypercerts/claim/evidence'
export * as OrgHypercertsClaimMeasurement from './types/org/hypercerts/claim/measurement'
export * as OrgHypercertsClaimRights from './types/org/hypercerts/claim/rights'
export * as AppGainforestCommonDefs from './types/app/gainforest/common/defs'
export * as AppGainforestOrganizationDefaultSite from './types/app/gainforest/organization/defaultSite'
export * as AppGainforestOrganizationGetIndexedOrganizations from './types/app/gainforest/organization/getIndexedOrganizations'
export * as AppGainforestOrganizationInfo from './types/app/gainforest/organization/info'
export * as AppGainforestOrganizationMeasuredTrees from './types/app/gainforest/organization/measuredTrees'
export * as AppGainforestOrganizationSite from './types/app/gainforest/organization/site'
export * as ComAtprotoRepoStrongRef from './types/com/atproto/repo/strongRef'

export class AtpBaseClient extends XrpcClient {
  app: AppNS
  org: OrgNS
  com: ComNS

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas)
    this.app = new AppNS(this)
    this.org = new OrgNS(this)
    this.com = new ComNS(this)
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this
  }
}

export class AppNS {
  _client: XrpcClient
  certified: AppCertifiedNS
  gainforest: AppGainforestNS

  constructor(client: XrpcClient) {
    this._client = client
    this.certified = new AppCertifiedNS(client)
    this.gainforest = new AppGainforestNS(client)
  }
}

export class AppCertifiedNS {
  _client: XrpcClient
  location: AppCertifiedLocationRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.location = new AppCertifiedLocationRecord(client)
  }
}

export class AppCertifiedLocationRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: AppCertifiedLocation.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'app.certified.location',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: AppCertifiedLocation.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'app.certified.location',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppCertifiedLocation.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.certified.location'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppCertifiedLocation.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.certified.location'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'app.certified.location', ...params },
      { headers },
    )
  }
}

export class AppGainforestNS {
  _client: XrpcClient
  organization: AppGainforestOrganizationNS

  constructor(client: XrpcClient) {
    this._client = client
    this.organization = new AppGainforestOrganizationNS(client)
  }
}

export class AppGainforestOrganizationNS {
  _client: XrpcClient
  defaultSite: AppGainforestOrganizationDefaultSiteRecord
  info: AppGainforestOrganizationInfoRecord
  measuredTrees: AppGainforestOrganizationMeasuredTreesRecord
  site: AppGainforestOrganizationSiteRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.defaultSite = new AppGainforestOrganizationDefaultSiteRecord(client)
    this.info = new AppGainforestOrganizationInfoRecord(client)
    this.measuredTrees = new AppGainforestOrganizationMeasuredTreesRecord(
      client,
    )
    this.site = new AppGainforestOrganizationSiteRecord(client)
  }

  getIndexedOrganizations(
    params?: AppGainforestOrganizationGetIndexedOrganizations.QueryParams,
    opts?: AppGainforestOrganizationGetIndexedOrganizations.CallOptions,
  ): Promise<AppGainforestOrganizationGetIndexedOrganizations.Response> {
    return this._client.call(
      'app.gainforest.organization.getIndexedOrganizations',
      params,
      undefined,
      opts,
    )
  }
}

export class AppGainforestOrganizationDefaultSiteRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: {
      uri: string
      value: AppGainforestOrganizationDefaultSite.Record
    }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'app.gainforest.organization.defaultSite',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: AppGainforestOrganizationDefaultSite.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'app.gainforest.organization.defaultSite',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppGainforestOrganizationDefaultSite.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.gainforest.organization.defaultSite'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      {
        collection,
        rkey: 'self',
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppGainforestOrganizationDefaultSite.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.gainforest.organization.defaultSite'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'app.gainforest.organization.defaultSite', ...params },
      { headers },
    )
  }
}

export class AppGainforestOrganizationInfoRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: AppGainforestOrganizationInfo.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'app.gainforest.organization.info',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: AppGainforestOrganizationInfo.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'app.gainforest.organization.info',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppGainforestOrganizationInfo.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.gainforest.organization.info'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      {
        collection,
        rkey: 'self',
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppGainforestOrganizationInfo.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.gainforest.organization.info'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'app.gainforest.organization.info', ...params },
      { headers },
    )
  }
}

export class AppGainforestOrganizationMeasuredTreesRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: {
      uri: string
      value: AppGainforestOrganizationMeasuredTrees.Record
    }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'app.gainforest.organization.measuredTrees',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: AppGainforestOrganizationMeasuredTrees.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'app.gainforest.organization.measuredTrees',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppGainforestOrganizationMeasuredTrees.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.gainforest.organization.measuredTrees'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      {
        collection,
        rkey: 'self',
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppGainforestOrganizationMeasuredTrees.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.gainforest.organization.measuredTrees'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'app.gainforest.organization.measuredTrees', ...params },
      { headers },
    )
  }
}

export class AppGainforestOrganizationSiteRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: AppGainforestOrganizationSite.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'app.gainforest.organization.site',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: AppGainforestOrganizationSite.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'app.gainforest.organization.site',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppGainforestOrganizationSite.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.gainforest.organization.site'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppGainforestOrganizationSite.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.gainforest.organization.site'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'app.gainforest.organization.site', ...params },
      { headers },
    )
  }
}

export class OrgNS {
  _client: XrpcClient
  hypercerts: OrgHypercertsNS

  constructor(client: XrpcClient) {
    this._client = client
    this.hypercerts = new OrgHypercertsNS(client)
  }
}

export class OrgHypercertsNS {
  _client: XrpcClient
  claim: OrgHypercertsClaimRecord
  claim: OrgHypercertsClaimNS

  constructor(client: XrpcClient) {
    this._client = client
    this.claim = new OrgHypercertsClaimNS(client)
    this.claim = new OrgHypercertsClaimRecord(client)
  }
}

export class OrgHypercertsClaimNS {
  _client: XrpcClient
  contribution: OrgHypercertsClaimContributionRecord
  evaluation: OrgHypercertsClaimEvaluationRecord
  evidence: OrgHypercertsClaimEvidenceRecord
  measurement: OrgHypercertsClaimMeasurementRecord
  rights: OrgHypercertsClaimRightsRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.contribution = new OrgHypercertsClaimContributionRecord(client)
    this.evaluation = new OrgHypercertsClaimEvaluationRecord(client)
    this.evidence = new OrgHypercertsClaimEvidenceRecord(client)
    this.measurement = new OrgHypercertsClaimMeasurementRecord(client)
    this.rights = new OrgHypercertsClaimRightsRecord(client)
  }
}

export class OrgHypercertsClaimContributionRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: OrgHypercertsClaimContribution.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'org.hypercerts.claim.contribution',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: OrgHypercertsClaimContribution.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'org.hypercerts.claim.contribution',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimContribution.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.contribution'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimContribution.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.contribution'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'org.hypercerts.claim.contribution', ...params },
      { headers },
    )
  }
}

export class OrgHypercertsClaimEvaluationRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: OrgHypercertsClaimEvaluation.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'org.hypercerts.claim.evaluation',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: OrgHypercertsClaimEvaluation.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'org.hypercerts.claim.evaluation',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimEvaluation.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.evaluation'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimEvaluation.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.evaluation'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'org.hypercerts.claim.evaluation', ...params },
      { headers },
    )
  }
}

export class OrgHypercertsClaimEvidenceRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: OrgHypercertsClaimEvidence.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'org.hypercerts.claim.evidence',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: OrgHypercertsClaimEvidence.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'org.hypercerts.claim.evidence',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimEvidence.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.evidence'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimEvidence.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.evidence'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'org.hypercerts.claim.evidence', ...params },
      { headers },
    )
  }
}

export class OrgHypercertsClaimMeasurementRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: OrgHypercertsClaimMeasurement.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'org.hypercerts.claim.measurement',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: OrgHypercertsClaimMeasurement.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'org.hypercerts.claim.measurement',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimMeasurement.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.measurement'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimMeasurement.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.measurement'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'org.hypercerts.claim.measurement', ...params },
      { headers },
    )
  }
}

export class OrgHypercertsClaimRightsRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: OrgHypercertsClaimRights.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'org.hypercerts.claim.rights',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: OrgHypercertsClaimRights.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'org.hypercerts.claim.rights',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimRights.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.rights'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaimRights.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim.rights'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'org.hypercerts.claim.rights', ...params },
      { headers },
    )
  }
}

export class OrgHypercertsClaimRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: OrgHypercertsClaim.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'org.hypercerts.claim',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: OrgHypercertsClaim.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'org.hypercerts.claim',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaim.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<OrgHypercertsClaim.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'org.hypercerts.claim'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'org.hypercerts.claim', ...params },
      { headers },
    )
  }
}

export class ComNS {
  _client: XrpcClient
  atproto: ComAtprotoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.atproto = new ComAtprotoNS(client)
  }
}

export class ComAtprotoNS {
  _client: XrpcClient
  repo: ComAtprotoRepoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.repo = new ComAtprotoRepoNS(client)
  }
}

export class ComAtprotoRepoNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }
}
