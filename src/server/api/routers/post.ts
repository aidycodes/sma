import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const postRouter = createTRPCRouter({
    new: privateProcedure
        .input(z.object({ title: z.string(), content: z.string(),
             tags: z.optional(z.array(z.string())), meta: z.optional(z.object
                ({color:z.string(), background:z.string(), image:z.string()})
                ) }))
        .mutation(async ({ input, ctx }) => {
            console.log({input})
           try{ 
            const post = await ctx.prisma.post.create({
                data:{...input,
                     userid:ctx.currentUser.user.userId,
                     meta: input.meta || 'JsonNull',
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
        .input(z.object({ postid: z.string(), userid: z.string(), currentUser: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try{
                const { postid, userid, currentUser } = input
                console.log({userid, currentUser})
                const [post_updatedAndNotifcation, like] = await Promise.all([ 
                    ctx.prisma.authUser.update({
                        where: { id: userid },
                        data: { notifications: {
                            create: { content:`${currentUser} liked your post!`, relativeid:postid, type:'likepost'} },    //username will be passed
                            posts:{update: {where: {postid: postid}, data: {likes_cnt: {increment: 1}}}}
                }
            }),
                    ctx.prisma.like.create({
                        data: { postid: postid, userid: ctx.currentUser.user.userId,
                            postid_userid:`${postid}_${ctx.currentUser.user.userId}`
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
            .input(z.object({ postid: z.string() }))
        .mutation(async ({ input, ctx }) => {
           try{
            const deletedLike = await ctx.prisma.post.update({
                where: { postid: input.postid },
                data: { likes_cnt: { decrement: 1 }, 
                likes: { deleteMany: { postid_userid:`${input.postid}_${ctx.currentUser.user.userId}` } },
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
    getPost: privateProcedure
        .input(z.object({ postid: z.string() }))
        .query(async ({ input, ctx }) => {
              try{
                const post = await ctx.prisma.post.findUnique({
                 where: { postid: input.postid },
                    include: { user:{ include:{
                        profile: true
                    }
                    },
                         likes: {
                                include: { user: { 
                                    select:{
                                    id:true, profile:true
                                }} },
                                },
                          comments: {
                                include: { user: {
                                    select:{
                                        id:true,
                                        profile: true
                                    }
                                    }, likes: {
                                    include: { user: {
                                        select:{
                                            id:true,
                                            profile: true
                                        }
                                    } },
                                } },
                                orderBy: { created_at: 'asc' },
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
            

/*

            const [like, likeCount] = await Promise.all([ 
                ctx.prisma.like.create({
                data: {
                    postid: input.postid,
                    userid: ctx.currentUser.user.userId,
                    postid_userid: `${input.postid}_${ctx.currentUser.user.userId}`,
                },
            }),
            ctx.prisma.post.update({
                where: { postid: input.postid },
                data: { likes_cnt: { increment: 1 } },
            })
        ])

  const deletedLike =  await ctx.prisma.like.deleteMany({
                where: { postid: input.postid,
                    userid: ctx.currentUser.user.userId },
            })

        */