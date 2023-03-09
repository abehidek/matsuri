import { z } from 'zod';

const nodeEnvironmentSchema = z.enum(["development", "test", "production"]);
type NodeEnvironment = z.infer<typeof nodeEnvironmentSchema>

const envSchema = z.object({
  NODE_ENV: nodeEnvironmentSchema,
  TEST_1: z.string(),
  TEST_2: z.string().nullable()
})

const processEnv: { [k in keyof z.infer<typeof envSchema>]: z.infer<typeof envSchema>[k] | undefined } = {
  NODE_ENV: (process.env.NODE_ENV as NodeEnvironment) || "development",
  TEST_1: process.env.TEST_1 || "Test environment variable",
  TEST_2: null
}

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

const env = parsed.data;

export { env }
