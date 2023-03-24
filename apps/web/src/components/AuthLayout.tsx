import { authClient } from "auth-sdk";
import { User } from "../../../auth/prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "./Loading";
import { Error } from "./Error";
import { Navigate } from "react-router-dom";
import { TRPCError } from "@trpc/server";

type AuthLayoutProps = {
  children: (user: User) => React.ReactNode;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ ...props }) => {
  const { data, isLoading, isError, error } = useQuery(["me"], () => authClient.me({}))

  if (isLoading) return <Loading />
  if (isError) {
    console.error(error);
    return <Error message={`Failed to fetch session on server`} />
  }

  if (!data.ok) {
    // alert user that is not signed in
    return <Navigate to="/" replace />
  }

  return (
    <>
      {props.children(data.user)}
    </>
  )
};

type OptionalAuthLayoutProps = {
  children: (user?: User) => React.ReactNode;
};

export { type User };

export const OptionalLayout: React.FC<OptionalAuthLayoutProps> = (props) => {
  const { isLoading, isError, data, error } = useQuery(["me"], () => authClient.me({}))

  if (isLoading) return <Loading />
  if (isError) {
    console.error(error);
    return <div>{props.children(undefined)}</div>
  }

  if (!data.ok) return <div>{props.children(undefined)}</div>

  return (
    <>
      {props.children(data.user)}
    </>
  )
}
