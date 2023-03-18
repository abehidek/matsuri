import axios, { type AxiosHeaders } from "axios";
import { $try } from "utils";
import { z } from "zod";

type Params = {
  authUrl: string;
  headers?: AxiosHeaders;
  credentials: SignInInputSchema;
};

export const signInInputSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
});

export type SignInInputSchema = z.infer<typeof signInInputSchema>;

type Ok = {
  ok: true;
  message: string;
};

type Err = {
  ok: false;
  message: string;
};

export const signIn = async (params: Params): Promise<Ok | Err> => {
  const [ok, err] = await $try(
    axios.post(`${params.authUrl}/signin`, params.credentials, {
      headers: {
        ...params.headers,
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
