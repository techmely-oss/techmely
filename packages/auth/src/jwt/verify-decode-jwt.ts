import { decodeProtectedHeader, importX509, jwtVerify } from "jose";
import { GOOGLE_SECURE_TOKEN_API_URL } from "../const";
import type { UserFromDecodedIdToken } from "./types";

export const verifyAndDecodeJwt = async (
  jwtToken: string,
  publicKeys: Record<string, string>,
  projectId: string,
): Promise<UserFromDecodedIdToken> => {
  try {
    const { kid } = decodeProtectedHeader(jwtToken);
    if (!kid) {
      throw new TypeError("invalid jwt header does not contain kid");
    }
    if (!publicKeys[kid]) {
      throw new TypeError("invalid kid or google public key has been updated recently");
    }
    const x509 = publicKeys[kid];
    const publicKey = await importX509(x509, "RS256");
    const { payload } = await jwtVerify(jwtToken, publicKey, {
      audience: projectId,
      issuer: `${GOOGLE_SECURE_TOKEN_API_URL}/${projectId}`,
    });

    return payload as UserFromDecodedIdToken;
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof TypeError) {
      throw new Error(e.message);
    }
    throw new Error("uncaught jwt decode exception");
  }
};
