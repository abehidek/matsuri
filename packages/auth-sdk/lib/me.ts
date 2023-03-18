import axios, { type AxiosHeaders } from "axios";
import { $try } from "utils";
import { type User } from "../../../apps/auth/prisma/client";

type Params = {
  authUrl: string;
  headers?: AxiosHeaders;
  sessionId?: string;
};

type Ok = {
  ok: true;
  message: string;
  user: User;
};

type Err = {
  ok: false;
  message: string;
};

export const me = async (params: Params): Promise<Ok | Err> => {
  const [response, err] = await $try(
    axios.get(`${params.authUrl}/me`, {
      headers: {
        ...params.headers,
        Cookie: params.sessionId ? `sessionId=${params.sessionId}` : undefined,
      },
      withCredentials: true,
    })
  );

  if (err) {
    if (axios.isAxiosError(err))
      return {
        ok: false,
        message: err.response?.data.message,
      };

    return { ok: false, message: err.message };
  }

  return {
    ok: true,
    message: response.data.message,
    user: response.data.user as User,
  };
};
