import { z } from "zod";
import { auth } from "auth/lucia";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { AuthRequest, Session } from "lucia-auth";
import { TRPCError } from "@trpc/server";


export const commentRouter = createTRPCRouter({
    new: privateProcedure
        .input(z.object({ title:z.string(), content: z.string(), postid: z.string(),
            meta: z.optional(z.object({}))  }))
        .mutation(async ({ input, ctx }) => {
              try{ 
                const comment = await ctx.prisma.comment.create({
                 data:{...input,
                        userid:ctx.currentUser.user.userId,
                        meta: JSON.stringify(input.meta) || 'JsonNull',
                 }                
          })
                return {
                 comment
                 }
            }catch(err){
                if(err instanceof Error){
               throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                } else {
                    console.log('unexpected error', err)
                }}
            }),
    edit: privateProcedure
        .input(z.object({ title: z.string(), content: z.string(), commentid: z.string(),
            meta: z.optional(z.object({})) }))
        .mutation(async ({ input, ctx }) => {
              try{
                const comment = await ctx.prisma.comment.update({
                 where: { commentid: input.commentid },
                 data: { ...input,
                      meta: input.meta && input.meta,
                 },
                })
                return {
                 comment
                }
            }catch(err){
                if(err instanceof Error){
               throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                } else {
                    console.log('unexpected error', err)
                }}
            }),
    delete: privateProcedure
        .input(z.object({ commentid: z.string() }))
        .mutation(async ({ input, ctx }) => {
                try{
                    const deletedComment = await ctx.prisma.comment.deleteMany({
                     where: { commentid: input.commentid,
                     }
                    })
                    return {
                     deletedComment
                    }
                }catch(err){
                    if(err instanceof Error){
                 throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }}
                }
        ),
        like: privateProcedure
        .input(z.object({ commentid: z.string() }))
        .mutation(async ({ input, ctx }) => {
                   try{
            const like = await ctx.prisma.like.create({
                data: {
                    commentid: input.commentid,
                    userid: ctx.currentUser.user.userId,
                    postid_userid: `${input.commentid}_${ctx.currentUser.user.userId}`,
                },
            })
            }catch(err){
                if(err instanceof Error){
               throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                } else {
                    console.log('unexpected error', err)
                }}
            }),
    unlike: privateProcedure
            .input(z.object({ commentid: z.string() }))
        .mutation(async ({ input, ctx }) => {
           try{
            const deletedLike = await ctx.prisma.like.deleteMany({
                where: { commentid: input.commentid,
                    userid: ctx.currentUser.user.userId },
            })
            return {
                deletedLike
            }
        }catch(err){
            if(err instanceof Error){
           throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
            } else {
                console.log('unexpected error', err)
            }}
        }),

})