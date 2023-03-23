import { $try } from "utils";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";


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
      message: "Failed to create note"
    })
  }

  return {
    message: "Succesfully created note"
  }
});

export const noteRouter = router({
  create
})