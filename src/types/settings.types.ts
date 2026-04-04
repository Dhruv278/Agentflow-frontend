export interface OrKeyStatus {
  hasKey: boolean;
  addedAt: string | null;
  lastUsedAt: string | null;
}

export interface OrKeyStatusResponse {
  data: OrKeyStatus;
}

export interface SaveOrKeyResponse {
  data: {
    message: string;
  };
}
