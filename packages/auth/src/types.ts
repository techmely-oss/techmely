/**
 * See in https://github.com/firebase/firebase-js-sdk/blob/master/packages/app/src/public-types.ts#L84
 */
export interface FirebaseConfigs {
  /**
   * An encrypted string used when calling certain APIs that don't need to
   * access private user data
   * (example value: `AIzaSyDOCAbC123dEf456GhI789jKl012-MnO`).
   */
  apiKey?: string;
  /**
   * Auth domain for the project ID.
   */
  authDomain?: string;
  /**
   * Default Realtime Database URL.
   */
  databaseURL?: string;
  /**
   * The unique identifier for the project across all of Firebase and
   * Google Cloud.
   */
  projectId?: string;
  /**
   * The default Cloud Storage bucket name.
   */
  storageBucket?: string;
  /**
   * Unique numerical value used to identify each sender that can send
   * Firebase Cloud Messaging messages to client apps.
   */
  messagingSenderId?: string;
  /**
   * Unique identifier for the app.
   */
  appId?: string;
  /**
   * An ID automatically created when you enable Analytics in your
   * Firebase project and register a web app. In versions 7.20.0
   * and higher, this parameter is optional.
   */
  measurementId?: string;
}

export type FirebaseAuthConfig = {
  apiKey: string;
  projectId: string;
};

export type AuthGoogleIdentityRequest = {
  config: FirebaseAuthConfig;
  options?: {
    /**
     * @default true
     */
    returnSecureToken: boolean;
  };
};

export type AuthSignInBasicRequest = {
  email: string;
  password: string;
};

export type AuthSignUpRequest = {
  email: string;
  password: string;
};

export type AuthGoogleIdentityResponse = {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
};

export type AuthExchangeTokenRequest = {
  //The refresh token's grant type, always "refresh_token".
  grant_type: string;
  //An Identity Platform refresh token.
  refresh_token: string;
};

export type AuthExchangeTokenResponse = {
  // The number of seconds in which the ID token expires.
  expires_in: string;
  // The type of the refresh token, always "Bearer".
  token_type: string;
  // The Identity Platform refresh token provided in the request or a new refresh token.
  refresh_token: string;
  // An Identity Platform ID token.
  id_token: string;
  // The uid corresponding to the provided ID token.
  user_id: string;
  // Your Google Cloud project ID.
  project_id: string;
};

type FederatedUserIdentifier = {
  providerId: string;
  rawId: string;
};

export type AuthLookUpRequest = {
  idToken: string;
  localId?: string[];
  email?: string[];
  delegatedProjectNumber?: string;
  phoneNumber?: string[];
  federatedUserId?: FederatedUserIdentifier[];
  tenantId?: string;
  targetProjectId?: string;
  initialEmail?: string[];
};

type ProviderUserInfo = {
  providerId: string;
  displayName: string;
  photoUrl: string;
  federatedId: string;
  email: string;
  rawId: string;
  screenName: string;
  phoneNumber: string;
};

type MfaEnrollment = {
  mfaEnrollmentId: string;
  displayName: string;
  enrolledAt: string;

  // Union field mfa_value can be only one of the following:
  phoneInfo: string;
  totpInfo: {
    emailAddress: string;
  };
  emailInfo: {
    emailAddress: string;
  };
  // End of list of possible types for union field mfa_value.

  // Union field unobfuscated_mfa_value can be only one of the following:
  unobfuscatedPhoneInfo: string;
  // End of list of possible types for union field unobfuscated_mfa_value.
};

export type AuthGoogleIdentifyUserInfo = {
  localId: string;
  email: string;
  displayName: string;
  language: string;
  photoUrl: string;
  timeZone: string;
  dateOfBirth: string;
  passwordHash: string;
  salt: string;
  version: number;
  emailVerified: boolean;
  passwordUpdatedAt: number;
  providerUserInfo: ProviderUserInfo[];
  validSince: string;
  disabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  screenName: string;
  customAuth: boolean;
  rawPassword: string;
  phoneNumber: string;
  customAttributes: string;
  emailLinkSignin: boolean;
  tenantId: string;
  mfaInfo: MfaEnrollment[];
  initialEmail: string;
  lastRefreshAt: string;
};

export type AuthGetAccountInfoResponse = {
  users: AuthGoogleIdentifyUserInfo[];
};

export type AuthGoogleIdentifyErrorResponse = {
  error: {
    code: number;
    message: string;
    errors?: GoogleIdentifyError[];
    status: AuthGoogleIdentifyErrorStatusCode;
    details: GoogleIdentifyDetailError[];
  };
};

type GoogleIdentifyError = {
  message: string;
  reason: string;
  domain: string;
};

export type AuthGoogleIdentifyErrorStatusCode =
  | "INVALID_ARGUMENT"
  | "INVALID_CUSTOM_TOKEN"
  | "CREDENTIAL_MISMATCH"
  | "TOKEN_EXPIRED"
  | "USER_DISABLED"
  | "USER_NOT_FOUND"
  | "INVALID_REFRESH_TOKEN"
  | "INVALID_GRANT_TYPE"
  | "MISSING_REFRESH_TOKEN"
  | "EMAIL_EXISTS"
  | "OPERATION_NOT_ALLOWED"
  | "TOO_MANY_ATTEMPTS_TRY_LATER"
  | "EMAIL_NOT_FOUND"
  | "INVALID_PASSWORD"
  | "USER_DISABLED"
  | "INVALID_ID_TOKEN"
  | (string & {});

type GoogleIdentifyDetailError = {
  "@type": string;
  reason: string;
  domain: string;
  metadata: Record<string, string>;
};
