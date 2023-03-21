import { authClient } from "auth-sdk";
import { User } from "../../../auth/prisma/client";
import { useQuery } from "@tanstack/react-query";

type AuthLayoutProps = {
  children: (user: User) => React.ReactNode;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ ...props }) => {
  const user = useQuery(["me"], () => authClient.me({}))

  if (user.isLoading) return <div>Loading...</div>
  if (user.isError) return <div>{JSON.stringify(user.error)}</div>
  if (!user.data.ok) return <div>{user.data.message}</div>

  return (
    <>
      {props.children(user.data.user)}
    </>
  )
};

type OptionalAuthLayoutProps = {
  children: (user?: User) => React.ReactNode;
};

export { type User };

export const OptionalLayout: React.FC<OptionalAuthLayoutProps> = (props) => {
  const user = useQuery(["me"], () => authClient.me({}))

  if (user.isLoading) return <div>Loading...</div>
  if (user.isError) return <div>{props.children(undefined)}</div>
  if (!user.data.ok) return <div>{props.children(undefined)}</div>

  return (
    <>
      {props.children(user.data.user)}
    </>
  )
}
