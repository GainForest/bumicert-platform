export type GetRecordResponse<T> = {
  value: T;
  uri: string;
  cid: string;
};

export type PutRecordResponse<T> = {
  uri: string;
  cid: string;
  commit?: string;
  validationStatus: "unknown" | (string & {}) | undefined;
  value: T;
};
