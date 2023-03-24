import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient, SignUpInputSchema, signUp, signUpInputSchema } from 'auth-sdk';
import { useMutation } from "@tanstack/react-query";
import { OptionalLayout } from "../components/AuthLayout";
import { Navigate } from "react-router-dom";
import { BaseLayout } from "../components/BaseLayout";

const SignUpPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpInputSchema>({
    resolver: zodResolver(signUpInputSchema),
  });

  const signUp = useMutation(["signUp"], (data: SignUpInputSchema) => {
    return authClient.signUp(data);
  }, {
    onSuccess: (data) => {
      // should redirect to sign in
      console.log("signUp Mut onSucess:", data)
      if (!data.ok) return alert(data.message)
      return alert(data.message)
    },
    onError: (err) => {
      console.error("signUp Mut onError:", err)
      alert("Something went wrong")
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    signUp.mutate(data);
  });

  return (
    <BaseLayout href="/signup" title="Sign Up">
      <OptionalLayout>
        {(user) => {
          if (user) return <Navigate to="/" replace />
          return (
            <form onSubmit={onSubmit}>
              <div>
                <label htmlFor="name">Your name</label>
                <p>{errors.name?.message}</p>
                <input placeholder="John Doe" type="text" {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                />
              </div>
              
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

              <button type="submit">Sign Up</button>
            </form>
          )
        }}
      </OptionalLayout>
    </BaseLayout>
  )
}

export default SignUpPage;
