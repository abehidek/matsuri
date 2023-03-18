import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient, SignInInputSchema, signInInputSchema } from 'auth-sdk';
import { useMutation } from "@tanstack/react-query";
import { OptionalLayout } from "../components/AuthLayout";
import { Navigate } from "react-router-dom";

const SignInPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInInputSchema>({
    resolver: zodResolver(signInInputSchema),
  });

  const signIn = useMutation(["signIn"], (data: SignInInputSchema) => {
    return authClient.signIn(data);
  }, {
    onSuccess: (data) => {
      console.log("signIn Mut onSucess:", data)
      if (!data.ok) return alert(data.message)
      return alert(data.message)
    },
    onError: (err) => {
      console.error("signIn Mut onError:", err)
      alert("Something went wrong")
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    signIn.mutate(data);
  });

  return (
    <div>
      <h1>Sign in</h1>
      <OptionalLayout>
        {(user) => {
          if (user) return <Navigate to="/" replace />
          return (
            <form onSubmit={onSubmit}>
              <div>
                <label htmlFor="email">Your email</label>
                <p>{errors.email?.message}</p>
                <input placeholder="john@doe.com" type="text" {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>

              <div>
                <label htmlFor="password">Your password</label>
                <p>{errors.password?.message}</p>
                <input placeholder="*******" type="password" {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
              </div>

              <button type="submit">Sign in</button>
            </form>
          )
        }}
      </OptionalLayout>
    </div>
  )
}

export default SignInPage;
