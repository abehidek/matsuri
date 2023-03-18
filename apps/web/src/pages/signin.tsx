import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8)
})

const SignInPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log("raw form data:", data);
  });

  return (
    <div>
      <h1>Sign In</h1>
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
    </div>
  )
}

export default SignInPage;
