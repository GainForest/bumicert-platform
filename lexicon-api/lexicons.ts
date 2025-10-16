/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util'

export const schemaDict = {
  AppCertifiedHypercertContribution: {
    lexicon: 1,
    id: 'app.certified.hypercert.contribution',
    defs: {
      main: {
        type: 'record',
        description: "A contribution made toward a hypercert's impact.",
        key: 'any',
        record: {
          type: 'object',
          required: ['contributor', 'role', 'createdAt'],
          properties: {
            hypercert: {
              type: 'ref',
              ref: 'lex:app.certified.hypercert.record',
              description: 'Reference to the hypercert',
            },
            role: {
              type: 'string',
              description: 'Role or title of the contributor',
              maxLength: 100,
            },
            contributor: {
              type: 'string',
              format: 'did',
              description: 'DID identifying the contributor',
            },
            description: {
              type: 'string',
              description: 'What the contributor concretely did',
              maxLength: 2000,
              maxGraphemes: 500,
            },
            workTimeframeFrom: {
              type: 'string',
              format: 'datetime',
              description: 'When this contributor started',
            },
            workTimeframeTo: {
              type: 'string',
              format: 'datetime',
              description: 'When this contributor finished',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  AppCertifiedHypercertEvaluation: {
    lexicon: 1,
    id: 'app.certified.hypercert.evaluation',
    defs: {
      main: {
        type: 'record',
        description: 'An evaluation of a hypercert or other claim',
        key: 'tid',
        record: {
          type: 'object',
          required: ['subject', 'evaluatorDID', 'summary', 'createdAt'],
          properties: {
            subject: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
              description:
                'Reference to what is being evaluated (hypercert, measurement, etc.)',
            },
            evaluatorDID: {
              type: 'string',
              format: 'did',
              description: 'DID of the evaluator',
            },
            evaluationURI: {
              type: 'string',
              format: 'uri',
              description: 'URI to detailed evaluation report or methodology',
            },
            summary: {
              type: 'string',
              description: 'Brief evaluation summary',
              maxLength: 5000,
              maxGraphemes: 1000,
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  AppCertifiedHypercertLocation: {
    lexicon: 1,
    id: 'app.certified.hypercert.location',
    defs: {
      main: {
        type: 'record',
        description: 'A location reference for a hypercert',
        key: 'any',
        record: {
          type: 'object',
          required: ['value', 'createdAt'],
          properties: {
            name: {
              type: 'string',
              description: 'Optional name for this location',
              maxLength: 200,
              maxGraphemes: 100,
            },
            description: {
              type: 'string',
              description: 'Optional description for this location',
              maxLength: 2000,
              maxGraphemes: 500,
            },
            srs: {
              type: 'string',
              description:
                'Spatial Reference System: the coordinate system within which the object is positioned (e.g ESPG:4326)',
              maxLength: 20,
            },
            value: {
              type: 'blob',
              accept: ['.geojson', '.kml'],
              description: 'The location of where the work was performed',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  AppCertifiedHypercertMeasurement: {
    lexicon: 1,
    id: 'app.certified.hypercert.measurement',
    defs: {
      main: {
        type: 'record',
        description: 'External measurement data supporting a hypercert claim',
        key: 'tid',
        record: {
          type: 'object',
          required: [
            'hypercert',
            'measurerDID',
            'metric',
            'value',
            'createdAt',
          ],
          properties: {
            hypercert: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
              description: 'Reference to the hypercert being measured',
            },
            measurerDID: {
              type: 'string',
              format: 'did',
              description: 'DID of the entity performing the measurement',
            },
            metric: {
              type: 'string',
              description: 'The metric being measured',
              maxLength: 500,
            },
            value: {
              type: 'string',
              description: 'The measured value',
              maxLength: 500,
            },
            measurementMethodURI: {
              type: 'string',
              format: 'uri',
              description:
                'URI to methodology documentation, standard protocol, or measurement procedure',
            },
            evidenceURI: {
              type: 'array',
              description: 'URIs to supporting evidence or data',
              items: {
                type: 'string',
                format: 'uri',
              },
              maxLength: 50,
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  AppCertifiedHypercertRecord: {
    lexicon: 1,
    id: 'app.certified.hypercert.record',
    defs: {
      evidence: {
        type: 'object',
        required: ['uri'],
        properties: {
          uri: {
            type: 'string',
            format: 'uri',
            description: 'Evidence resource URI',
          },
          title: {
            type: 'string',
            maxLength: 256,
            description:
              'Optional title to describe the nature of the evidence',
          },
        },
      },
      main: {
        type: 'record',
        description: 'A hypercert record tracking impact work.',
        key: 'any',
        record: {
          type: 'object',
          required: [
            'hypercertID',
            'title',
            'description',
            'image',
            'createdAt',
            'workScope',
            'workTimeframeFrom',
            'workTimeFrameTo',
          ],
          properties: {
            title: {
              type: 'string',
              description: 'Title of the hypercert',
              maxLength: 256,
            },
            hypercertID: {
              type: 'string',
              description: 'Identifier for the impact claim',
              maxLength: 256,
            },
            description: {
              type: 'string',
              format: 'uri',
              description: 'A description of the impact work done.',
              maxLength: 30000,
              maxGraphemes: 3000,
            },
            image: {
              type: 'blob',
              accept: ['image/*'],
              maxSize: 5000000,
              description:
                'Blob reference to hypercert image/visual representation. Maximum size is in bytes',
            },
            workScope: {
              type: 'string',
              description: 'Scope of the work performed',
              maxLength: 5000,
              maxGraphemes: 1000,
            },
            workTimeframeFrom: {
              type: 'string',
              format: 'datetime',
              description: 'When the work began',
            },
            workTimeFrameTo: {
              type: 'string',
              format: 'datetime',
              description: 'When the work ended',
            },
            evidence: {
              type: 'array',
              description:
                'Supporting evidence, documentation, or external data URIs',
              items: {
                type: 'ref',
                ref: 'lex:app.certified.hypercert.record#evidence',
              },
              maxLength: 100,
            },
            contributors: {
              type: 'array',
              description: 'DIDs identifying contributors to this hypercert',
              items: {
                type: 'string',
                format: 'did',
              },
              maxLength: 100,
            },
            rights: {
              type: 'string',
              description:
                'Rights keyword (as defined in app.certified.hypercert.rights)',
              maxLength: 10,
            },
            location: {
              type: 'string',
              format: 'at-uri',
              description:
                'AT URI referencing a location record (app.certified.hypercert.location)',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  AppCertifiedHypercertRights: {
    lexicon: 1,
    id: 'app.certified.hypercert.rights',
    defs: {
      main: {
        type: 'record',
        description:
          'Describes the rights that a user has with a hypercert, such as whether it can be sold, transferred, and under what conditions.',
        key: 'any',
        record: {
          type: 'object',
          required: ['rightsType', 'rightsDescription'],
          properties: {
            rightsName: {
              type: 'string',
              description: 'Full name of the rights',
              maxLength: 100,
            },
            rightsType: {
              type: 'string',
              description: 'Short rights identifer for easier search',
              maxLength: 10,
            },
            rightsDescription: {
              type: 'string',
              description: 'Description of the rights of this hypercert',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  AppCertifiedHypercertSale: {
    lexicon: 1,
    id: 'app.certified.hypercert.sale',
    defs: {
      main: {
        type: 'record',
        description: 'A record of a non-tokenized hypercert sale transaction',
        key: 'tid',
        record: {
          type: 'object',
          required: ['hypercert', 'fractionPurchased'],
          properties: {
            hypercert: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
              description: 'Reference to the hypercert record being sold',
            },
            fractionPurchased: {
              type: 'string',
              description: 'Fraction of the hypercert purchased (0.0 to 1.0)',
            },
            priceAmount: {
              type: 'string',
              description: 'Purchase price amount',
            },
            priceCurrency: {
              type: 'string',
              description: "Currency (e.g., 'USD', 'EUR')",
              maxLength: 10,
            },
            buyerDID: {
              type: 'string',
              format: 'uri',
              description: 'DID identifying the buyer',
            },
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  AppCertifiedHypercertContribution: 'app.certified.hypercert.contribution',
  AppCertifiedHypercertEvaluation: 'app.certified.hypercert.evaluation',
  AppCertifiedHypercertLocation: 'app.certified.hypercert.location',
  AppCertifiedHypercertMeasurement: 'app.certified.hypercert.measurement',
  AppCertifiedHypercertRecord: 'app.certified.hypercert.record',
  AppCertifiedHypercertRights: 'app.certified.hypercert.rights',
  AppCertifiedHypercertSale: 'app.certified.hypercert.sale',
} as const
