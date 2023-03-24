import { $try } from "utils";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const all = protectedProcedure.query(async ({ ctx }) => {
  const [notes, err] = await $try(ctx.prisma.note.findMany({
    where: {
      userId: ctx.user.id
    },
    select: {
      id: true,
      content: true,
      updatedAt: true
    }
  }));

  if (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: err,
      message: "Something went wrong when getting your notes."
    })
  }

  return {
    message: "Succesfully retrieve your notes.",
    notes
  }
})

const create = protectedProcedure.input(z.object({
  content: z.string().min(1),
})).mutation(async ({ ctx, input }) => {
  const [_, err] = await $try(ctx.prisma.note.create({
    data: {
      userId: ctx.user.id,
      content: input.content,
    }
  }));

  if (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: err,
      message: "Something went wrong when creating your note."
    })
  }

  return {
    message: "Succesfully created note."
  }
});

export const noteRouter = router({
  all,
  create
})