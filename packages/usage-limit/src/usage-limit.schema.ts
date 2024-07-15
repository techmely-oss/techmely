import { boolean, number, object, optional, string } from "valibot";

export const limitRequestSchema = object({
  keyId: string(),
});

export const limitResponseSchema = object({
  valid: boolean(),
  remaining: optional(number()),
});

export const revalidateRequestSchema = object({
  keyId: string(),
});
