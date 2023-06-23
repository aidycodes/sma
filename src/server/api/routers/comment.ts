import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const commentRouter = createTRPCRouter({
    new: privateProcedure
        .input(z.object({ title:z.string(), content: z.string(), postid: z.string(),
            meta: z.optional(z.object({}))  }))
        .mutation(async ({ input, ctx }) => {
              try{ 

                const comment = await ctx.prisma.post.update({
                    where: { postid: input.postid },
                    data:{comment_cnt: {increment: 1},                   
                    comments: {
                        create: {
                            title: input.title,
                            content: input.content,
                            userid: ctx.currentUser.user.userId,
                            meta: JSON.stringify(input.meta) || 'JsonNull',
                        }
                }
        }})
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
        .input(z.object({ commentid: z.string(), postid: z.string() }))
        .mutation(async ({ input, ctx }) => {
                try{
                   const deletedComment = await ctx.prisma.post.update({
                    where:{postid: input.postid},
                    data:{comment_cnt: {decrement: 1},
                    comments: {
                        delete: {commentid: input.commentid}
                    }
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
        .input(z.object({ commentid: z.string(), userid: z.string(), currentUser: z.string(), postid: z.string() }))
        .mutation(async ({ input, ctx }) => {
                   try{
            const { commentid, userid, currentUser, postid } = input
                const [comment_updatedAndNotifcation, like] = await Promise.all([ 
                    ctx.prisma.authUser.update({
                        where: { id: userid },
                        data: { notifications: {
                            create: { content:`${currentUser} liked your comment!`, relativeId:postid, type:'comment'} },    //username will be passed
                            comments:{update: {where: {commentid: commentid}, data: {likes_cnt: {increment: 1}}}}
                }
            }),
                    ctx.prisma.like.create({
                        data: { commentid: commentid, userid: ctx.currentUser.user.userId,
                            postid_userid:`${commentid}_${ctx.currentUser.user.userId}`
                        }
                    })
        ]) 
                return{
                    like
                }
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
            const deletedLike = await ctx.prisma.comment.update({
                where: { commentid: input.commentid },
                data: { likes_cnt: { decrement: 1 }, 
                likes: { deleteMany: { postid_userid:`${input.commentid}_${ctx.currentUser.user.userId}` } },
            }
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