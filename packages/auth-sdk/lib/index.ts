import { env } from "env";
import { me } from "./me";
import { type AxiosHeaders } from "axios";
import { signIn } from "./signin";
import { signInInputSchema, type SignInInputSchema } from "./signin";
import { signOut } from "./signout";
import { signUpInputSchema, SignUpInputSchema, signUp } from "./signup";

type AuthClientConfig = {
  authUrl: string;
};

export { SignInInputSchema, signInInputSchema };

export class AuthClient {
  private authUrl: string;

  constructor(config: AuthClientConfig) {
    this.authUrl = config.authUrl;
  }

  async me(params: { headers?: AxiosHeaders; sessionId?: string }) {
    return await me({
      authUrl: this.authUrl,
      headers: params.headers,
      sessionId: params.sessionId,
    });
  }

  async signIn(credentials: SignInInputSchema, headers?: AxiosHeaders) {
    return await signIn({
      authUrl: this.authUrl,
      headers: headers,
      credentials: credentials,
    });
  }

  async signUp(credentials: SignUpInputSchema, headers?: AxiosHeaders) {
    return await signUp({
      authUrl: this.authUrl,
      headers: headers,
      credentials: credentials,
    });
  }

  async signOut(params: { headers?: AxiosHeaders; sessionId?: string }) {
    return await signOut({
      authUrl: this.authUrl,
      headers: params.headers,
      sessionId: params.sessionId,
    });
  }
}

export const authClient = new AuthClient({
  authUrl: env.PUBLIC_AUTH_URL,
});

export { signIn, signOut, me, signUpInputSchema, type SignUpInputSchema, signUp };
