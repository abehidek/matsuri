import axios, { type AxiosHeaders } from "axios";
import { $try } from "utils";

type Params = {
  authUrl: string;
  headers?: AxiosHeaders;
  sessionId?: string;
};

type Ok = {
  ok: true;
  message: string;
};

type Err = {
  ok: false;
  message: string;
};

export const signOut = async (params: Params): Promise<Ok | Err> => {
  const [ok, err] = await $try(
    axios.delete(`${params.authUrl}/signout`, {
      headers: {
        ...params.headers,
        Cookie: params.sessionId ? `sessionId=${params.sessionId}` : undefined,
      },
      withCredentials: true,
    })
  );

  if (err) {
    if (axios.isAxiosError(err))
      return { ok: false, message: err.response?.data.message };
    return { ok: false, message: err.message };
  }

  return {
    ok: true,
    message: ok.data.message,
  };
};
