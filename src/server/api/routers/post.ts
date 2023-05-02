import { z } from "zod";
import { auth } from "auth/lucia";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { AuthRequest, Session } from "lucia-auth";
import { TRPCError } from "@trpc/server";


export const postRouter = createTRPCRouter({
    new: privateProcedure
        .input(z.object({ title: z.string(), content: z.string(),
             tags: z.optional(z.array(z.string())), meta: z.optional(z.object({})) }))
        .mutation(async ({ input, ctx }) => {
           try{ 
            const post = await ctx.prisma.post.create({
                data:{...input,
                     userid:ctx.currentUser.user.userId,
                     meta: JSON.stringify(input.meta) || 'JsonNull',
                }
            
        })
            return {
                post
                }
        }catch(err){
            if(err instanceof Error){
           throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
            } else {
                console.log('unexpected error', err)
            }}
        }),
    edit: privateProcedure
        .input(z.object({ title: z.string(), content: z.string(), postid: z.string(), 
         tags: z.optional(z.array(z.string())), meta: z.optional(z.object({url: z.string()}))
        }))
        .mutation(async ({ input, ctx }) => {
           try{
            const post = await ctx.prisma.post.update({
                where: { postid: input.postid },
                data: { ...input,
                    meta: input.meta && input.meta,
                },
            })
            return {
                post
            }
        }catch(err){
            if(err instanceof Error){
           throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
            } else {
                console.log('unexpected error', err)
            }}

        }),
    delete: privateProcedure
        .input(z.object({ postid: z.string() }))
        .mutation(async ({ input, ctx }) => {
           try{
            const deletedPost = await ctx.prisma.post.deleteMany({
                where: { postid: input.postid,
                    userid: ctx.currentUser.user.userId },
            })
            return {
                deletedPost
            }
        }catch(err){
            if(err instanceof Error){
           throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
            } else {
                console.log('unexpected error', err)
            }}
        }),
    like: privateProcedure
        .input(z.object({ postid: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try{
            const like = await ctx.prisma.like.create({
                data: {
                    postid: input.postid,
                    userid: ctx.currentUser.user.userId,
                    postid_userid: `${input.postid}_${ctx.currentUser.user.userId}`,
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
            .input(z.object({ postid: z.string() }))
        .mutation(async ({ input, ctx }) => {
           try{
            const deletedLike = await ctx.prisma.like.deleteMany({
                where: { postid: input.postid,
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
        getPost: privateProcedure
        .input(z.object({ postid: z.string() }))
        .query(async ({ input, ctx }) => {
              try{
                const post = await ctx.prisma.post.findUnique({
                 where: { postid: input.postid },
                    include: { user: true,
                         likes: {
                                include: { user: true },
                                },
                          comments: {
                                include: { user: true, likes: {
                                    include: { user: true },
                                } },
                          } },
                })
                return {
                 post
                }
            }catch(err){
                if(err instanceof Error){
               throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                } else {
                    console.log('unexpected error', err)
                }}
        })
    })
            

