import { z } from 'zod';

const nodeEnvironmentSchema = z.enum(["development", "test", "production"]);
type NodeEnvironment = z.infer<typeof nodeEnvironmentSchema>

const serverSchema = z.object({
  NODE_ENV: nodeEnvironmentSchema,
  TEST_1: z.string(),
  TEST_2: z.string().nullable(),
  SERVER_DATABASE_URL: z.string()
})

const publicSchema = z.object({
  PUBLIC_TEST_1: z.string(),
  PUBLIC_TEST_2: z.number()
})

const mergedSchema = publicSchema.merge(serverSchema)

type MergedInput = z.input<typeof mergedSchema>;
type MergedOutput = z.infer<typeof mergedSchema>;
type MergedSafeParseReturn = z.SafeParseReturnType<MergedInput, MergedOutput>

const processEnv: {
  [k in keyof z.infer<typeof mergedSchema>]: z.infer<typeof mergedSchema>[k] | undefined
} = {
  NODE_ENV: (process.env.NODE_ENV as NodeEnvironment) || "development",
  TEST_1: process.env.TEST_1,
  TEST_2: null,
  PUBLIC_TEST_1: process.env.PUBLIC_TEST_1,
  PUBLIC_TEST_2: Number(process.env.PUBLIC_TEST_2),
  SERVER_DATABASE_URL: process.env.SERVER_DATABASE_URL
}

const isServer = typeof window === "undefined";

const parsed = (
  (isServer
    ? mergedSchema.safeParse(processEnv)
    : publicSchema.safeParse(processEnv)) as MergedSafeParseReturn
);

if (parsed.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

const env: MergedOutput = new Proxy(parsed.data, {
  get(target, prop) {
    if (typeof prop !== "string") return undefined;
    // Throw a descriptive error if a server-side env var is accessed on the client
    // Otherwise it would just be returning `undefined` and be annoying to debug
    if (!isServer && !prop.startsWith("PUBLIC_"))
      throw new Error(
        process.env.NODE_ENV === "production"
          ? "❌ Attempted to access a server-side environment variable on the client"
          : `❌ Attempted to access server-side environment variable '${prop}' on the client`
      );
    return target[(prop) as keyof typeof target];
  },
});

export { env }
