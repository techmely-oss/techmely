import { GOOGLE_TOOKIT_ACCOUNTS_URL } from "../../const";
import type { AuthGetAccountInfoResponse, AuthLookUpRequest, FirebaseConfigs } from "../../types";
import { GoogleIdentityError } from "../error";

export async function googleAccountLookUp(
  config: FirebaseConfigs,
  payload: AuthLookUpRequest,
): Promise<AuthGetAccountInfoResponse> {
  const response = await fetch(`${GOOGLE_TOOKIT_ACCOUNTS_URL}:lookup?key=${config.apiKey}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (!response.ok) {
    throw new GoogleIdentityError(json);
  }
  return json;
}
