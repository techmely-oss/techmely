export type UsageLimitResponse = {
  keyId: string;
};
export type UsageLimitRevalidateRequest = {
  valid: boolean;
  remaining?: number;
};

export type UsageLimitRequest = {
  keyId: string;
};

export interface UsageLimiterPort {
  limit: (req: UsageLimitRequest) => Promise<UsageLimitResponse>;
  revalidate: (req: UsageLimitRevalidateRequest) => Promise<void>;
}
