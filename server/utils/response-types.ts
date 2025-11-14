export type GetRecordResponse<T> = {
  value: T;
  uri: string;
  cid: string;
};

export type PutRecordResponse<T> = {
  success: true;
  data: {
    uri: string;
    cid: string;
    commit?: string;
    validationStatus: "unknown" | (string & {}) | undefined;
  };
  headers: Record<string, string>;
  value: T;
};
