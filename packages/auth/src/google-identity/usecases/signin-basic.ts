import { GOOGLE_TOOKIT_ACCOUNTS_URL } from "../../const";
import type {
  AuthGoogleIdentityRequest,
  AuthGoogleIdentityResponse,
  AuthSignInBasicRequest,
} from "../../types";
import { GoogleIdentityError } from "../error";

export const signInBasic =
  ({ config, options = { returnSecureToken: true } }: AuthGoogleIdentityRequest) =>
  async (payload: AuthSignInBasicRequest): Promise<AuthGoogleIdentityResponse> => {
    const response = await fetch(
      `${GOOGLE_TOOKIT_ACCOUNTS_URL}:signInWithPassword?key=${config.apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          returnSecureToken: options.returnSecureToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const json = await response.json();
    if (!response.ok) {
      throw new GoogleIdentityError(json);
    }
    return json;
  };
