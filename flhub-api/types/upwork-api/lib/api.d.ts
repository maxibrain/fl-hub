/// <reference path="./routers/auth.d.ts" />
/// <reference path="./routers/freelancers/search.d.ts" />

declare namespace Upwork {
  enum SignatureMethod {
    HMACSHA1 = 'HMAC-SHA1',
  }

  interface Config {
    consumerKey: string;
    consumerSecret: string;
    accessToken?: string;
    accessSecret?: string;
    signatureMethod?: SignatureMethod;
    debug?: boolean;
  }

  type GetAccessTokenCallback = (
    error?: UpworkError,
    accessToken?: string,
    accessTokenSecret?: string,
  ) => void;
  type GetAuthorizationUrlCallback = (
    error?: UpworkError,
    url?: string,
    requestToken?: string,
    requestTokenSecret?: string,
  ) => void;

  interface Client {
    getAccessToken(
      requestToken: string,
      requestTokenSecret: string,
      verifier: string,
      callback: GetAccessTokenCallback,
    ): void;
    setAccessToken(token: string, secret: string, callback: VoidCallback): void;
  }

  class UpworkApi {
    constructor(options: Config, client?: Client);
    readonly client: Client;
    getAccessToken(
      requestToken: string,
      requestTokenSecret: string,
      verifier: string,
      callback: GetAccessTokenCallback,
    ): void;
    getAuthorizationUrl(
      callbackUrl: string | GetAuthorizationUrlCallback,
      callback?: GetAuthorizationUrlCallback,
    ): void;
    setAccessToken(token: string, secret: string, callback: VoidCallback): void;
  }
}

export = Upwork;
