import { GOOGLE_SECURE_TOKEN_API_URL } from "../../const";
import type {
  AuthExchangeTokenRequest,
  AuthExchangeTokenResponse,
  FirebaseConfigs,
} from "../../types";
import { GoogleIdentityError } from "../error";

const SECURE_TOKEN_URL = `${GOOGLE_SECURE_TOKEN_API_URL}/v1/token`;

export async function googleExchangeToken(
  config: FirebaseConfigs,
  request: AuthExchangeTokenRequest,
): Promise<AuthExchangeTokenResponse> {
  const body = new URLSearchParams();
  body.append("grant_type", request.grant_type);
  body.append("refresh_token", request.refresh_token);

  const response = await fetch(`${SECURE_TOKEN_URL}?key=${config.apiKey}`, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const json = await response.json();
  if (!response.ok) {
    throw new GoogleIdentityError(json);
  }
  return json;
}
