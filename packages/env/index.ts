import { z } from 'zod';

const nodeEnvironmentSchema = z.enum(["development", "test", "production"]);
type NodeEnvironment = z.infer<typeof nodeEnvironmentSchema>

const serverSchema = z.object({
  NODE_ENV: nodeEnvironmentSchema,
  TEST_1: z.string(),
  TEST_2: z.string().nullable(),
  SERVER_DATABASE_URL: z.string(),
  AUTH_DATABASE_URL: z.string(),
  LOG_DATABASE_URL: z.string()
})

const publicSchema = z.object({
  PUBLIC_TEST_1: z.string(),
  PUBLIC_TEST_2: z.number(),
  // Web1
  PUBLIC_WEB_URL: z.string(),
  PUBLIC_WEB_PORT: z.number(),
  // Server
  PUBLIC_SERVER_URL: z.string(),
  PUBLIC_SERVER_PORT: z.number(),
  // Auth
  PUBLIC_AUTH_URL: z.string(),
  PUBLIC_AUTH_PORT: z.number(),
  // Log
  PUBLIC_LOG_URL: z.string(),
  PUBLIC_LOG_PORT: z.number(),
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

  // Web
  PUBLIC_WEB_URL: process.env.PUBLIC_WEB_URL || "http://localhost:3000",
  PUBLIC_WEB_PORT: Number(process.env.PUBLIC_WEB_PORT) || 3000,
  // Server
  PUBLIC_SERVER_URL: process.env.PUBLIC_SERVER_URL || "http://localhost:4000",
  PUBLIC_SERVER_PORT: Number(process.env.PUBLIC_SERVER_PORT) || 4000,
  SERVER_DATABASE_URL: process.env.SERVER_DATABASE_URL,
  // Auth
  PUBLIC_AUTH_URL: process.env.PUBLIC_AUTH_URL || "http://localhost:5000",
  PUBLIC_AUTH_PORT: Number(process.env.PUBLIC_AUTH_PORT) || 5000,
  AUTH_DATABASE_URL: process.env.AUTH_DATABASE_URL,
  // Log:
  PUBLIC_LOG_URL: process.env.PUBLIC_LOG_URL || "http://localhost:5001",
  PUBLIC_LOG_PORT: Number(process.env.PUBLIC_LOG_PORT) || 5001,
  LOG_DATABASE_URL: process.env.LOG_DATABASE_URL
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
