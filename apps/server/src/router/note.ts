import { $try } from "utils";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const get = protectedProcedure.input(z.object({ id: z.string().min(1) }))
  .query(async ({ ctx, input }) => {
    const [note, findErr] = await $try(ctx.prisma.note.findUnique({
      where: { id: input.id }
    }))

    if (findErr) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: findErr,
        message: "Something went wrong when getting your note.",
      });
    }

    if (!note) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No note was found.",
      });
    }

    if (note.userId !== ctx.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have the permission to get this note.",
      });
    }

    return {
      message: "Succesfully retrieve the note.",
      note
    }
  })

const del = protectedProcedure
  .input(z.object({ id: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    const [note, findErr] = await $try(ctx.prisma.note.findUnique({
      where: { id: input.id }
    }))

    if (findErr) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: findErr,
        message: "Something went wrong when deleting your note.",
      });
    }

    if (!note) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No note was found to be deleted.",
      });
    }

    if (note.userId !== ctx.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have the permission to delete this note.",
      });
    }

    const [_, deleteErr] = await $try(ctx.prisma.note.delete({
      where: { id: input.id }
    }))

    if (deleteErr) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: deleteErr,
        message: "Something went wrong when deleting your note.",
      });
    }

    return {
      message: "Succesfully deleted note.",
    };
  });

const all = protectedProcedure.query(async ({ ctx }) => {
  const [notes, err] = await $try(
    ctx.prisma.note.findMany({
      where: {
        userId: ctx.user.id,
      },
      select: {
        id: true,
        content: true,
        updatedAt: true,
      },
    })
  );

  if (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: err,
      message: "Something went wrong when getting your notes.",
    });
  }

  return {
    message: "Succesfully retrieve your notes.",
    notes,
  };
});

const create = protectedProcedure
  .input(
    z.object({
      content: z.string().min(1),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const [_, err] = await $try(
      ctx.prisma.note.create({
        data: {
          userId: ctx.user.id,
          content: input.content,
        },
      })
    );

    if (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: err,
        message: "Something went wrong when creating your note.",
      });
    }

    return {
      message: "Succesfully created note.",
    };
  });

export const noteRouter = router({
  get,
  del,
  all,
  create,
});
