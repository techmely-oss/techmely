import type { AuthGoogleIdentityRequest } from "../../types";
import { GoogleIdentityError } from "../error";

export type SignInWithCustomTokenPayload = {
  token: string;
};

export type SignInWithCustomTokenResponse = {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
};

export const signInWithCustomToken =
  ({ config, options = { returnSecureToken: true } }: AuthGoogleIdentityRequest) =>
  async (payload: SignInWithCustomTokenPayload): Promise<SignInWithCustomTokenResponse> => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${config.apiKey}`,
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
    return json as SignInWithCustomTokenResponse;
  };
