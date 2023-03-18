import express, {
  CookieOptions,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { logger } from "src";
import { $try } from "utils";
import { z } from "zod";
import { User, prisma } from "../../prisma/client";
import { comparePassword } from "src/lib/password";
import { env } from "env";

const router = express.Router();

type AuthRequest = Request & {
  user?: User;
  sessionId?: string;
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  logger.log("Authentication middleware", "auth:auth");
  const parseResult = z
    .object({
      sessionId: z.string().min(1),
    })
    .safeParse(req.cookies);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Failed to parse request cookies",
    });
  }

  const { sessionId } = parseResult.data;

  const [session, sessionError] = await $try(
    prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    })
  );

  if (sessionError) {
    logger.log("Failed to fetch session", "auth:auth");
    console.error(sessionError);
    return res.status(500).json({
      message: "Failed to fetch session",
    });
  }

  if (!session) {
    return res.status(404).json({
      message: "Session not found",
    });
  }

  const [user, userError] = await $try(
    prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    })
  );

  if (userError) {
    logger.log("Failed to fetch user", "auth:auth");
    console.error(sessionError);
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }

  if (!user) {
    return res.status(404).json({
      message: "User not founded",
    });
  }

  req.sessionId = sessionId;
  req.user = user;
  next();
};

router.get("/me", authenticate, (req: AuthRequest, res) => {
  const user = req.user as User;

  return res.status(200).json({
    user,
    message: "Succesfully retrieve user",
  });
});

const SESSION_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24;
const SESSION_COOKIE_OPTS: CookieOptions = {
  httpOnly: true,
  maxAge: SESSION_COOKIE_MAX_AGE,
  signed: false,
  sameSite: "lax",
  domain: env.DOMAIN_URL ? env.DOMAIN_URL : undefined,
};

import { signInInputSchema } from "auth-sdk";

router.post("/signin", async (req, res) => {
  const parseResult = signInInputSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Failed to parse request cookies",
      error: parseResult.error.format(),
    });
  }

  const { email, password } = parseResult.data;

  const [user, userError] = await $try(
    prisma.user.findUnique({
      where: {
        email,
      },
    })
  );

  if (userError) {
    logger.log("Failed to fetch user", "auth:sign-in");
    console.error(userError);
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }

  if (!user)
    return res.status(401).json({ message: "Wrong email or password" });

  const [isPasswordValid, isPasswordValidError] = await $try(
    comparePassword(password, user.passwordHash)
  );

  if (isPasswordValidError) {
    logger.log("Failed to verify user password", "auth:sign-in");
    console.error(isPasswordValidError);
    return res.status(500).json({
      message: "Failed to verify password",
    });
  }

  if (!isPasswordValid)
    return res.status(401).json({
      message: "Wrong email or password",
    });

  const [session, sessionError] = await $try(
    prisma.session.create({
      data: {
        userId: user.id,
      },
    })
  );

  if (sessionError) {
    logger.log("Failed to create user session", "auth:sign-in");
    console.error(sessionError);
    return res.status(500).json({ message: "Failed to create user session" });
  }

  logger.log("User sign-in", "auth:sign-in");
  return res
    .cookie("sessionId", session.id, SESSION_COOKIE_OPTS)
    .status(201)
    .json({ message: "User session created succesfully" });
});

router.delete("/signout", authenticate, async (req: AuthRequest, res) => {
  const [_, sessionError] = await $try(
    prisma.session.delete({
      where: {
        id: req.sessionId,
      },
    })
  );

  if (sessionError) {
    logger.log("Failed to sign out", "auth:sign-out");
    console.error(sessionError);
    return res.clearCookie("sessionId").status(500).json({
      message: "Failed to sign out",
    });
  }

  return res
    .clearCookie("sessionId")
    .status(200)
    .json({ message: "Sign out succesfully" });
});

export default router;
