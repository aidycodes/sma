import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const userQueryRouter = createTRPCRouter({
    getUserProfile: publicProcedure
            
            .query( async({ input, ctx }) => {
                try{
                if(ctx.currentUser?.user?.userId == null){
                    throw new TRPCError({message: "no user", code: "INTERNAL_SERVER_ERROR"})
                }
                const { userId } = ctx.currentUser.user
                    const user = await ctx.prisma.userProfile.findUnique({where: {userid: userId}});
                    return {
                        user
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
    getProfile: publicProcedure
            .input(z.object({id: z.string()}))
            .query( async({ input, ctx }) => {
                try{
                    const { id } = input;
                    const user = await ctx.prisma.userProfile.findUnique({where: {userid: id}});
                    return {
                        user
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
    getUserPosts: publicProcedure
            .input(z.object({id: z.string(), postAmt:z.number(), postSkip: z.number(), commentAmt: z.number()}))
            .query( async({ input, ctx }) => {
                try{
                    const { id, commentAmt, postAmt, postSkip } = input;
                    const posts = await ctx.prisma.post.findMany({
                        where: {userid: id},
                        orderBy: {created_at: 'asc'},
                        take:postAmt,
                        skip:postSkip,
                        include: {comments: {
                            include: {user: true, likes:{
                                select: {user: {
                                    select:{
                                        username:true, id:true}}
                                    },
                                take:2
                            }},
                            orderBy: {created_at: 'desc'},
                            take:commentAmt,
                            
                        },
                        likes:{
                            select: {user: {
                                select:{username:true, id:true}
                                }},
                            take:2
                        }
                    }
                    });
                    return {
                        posts
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
    getMoreComments: publicProcedure
            .input(z.object({id: z.string(), commentAmt: z.number(), commentSkip: z.number()})) 
            .query( async({ input, ctx }) => {
                try{
                    const { id, commentAmt, commentSkip } = input;
                    const comments = await ctx.prisma.comment.findMany({
                        where: {postid: id},
                        orderBy: {created_at: 'desc'},
                        take:commentAmt,
                        skip:commentSkip,
                        include: {
                            user: true,
                            likes:{
                                include: {user: true},
                                take:2
                            }
                        }
                    })          
                    return {
                        comments
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),

    getNotifcations: privateProcedure
                .input(z.object({
                    take: z.number().optional(),
                cursor:  z.object({ nofiy_user_id: z.string(), created_at: z.date() }).optional()
            })
                )
            .query( async({ input:{take = 10, cursor}, ctx }) => {
                try{
                    
                    const notifcations = await ctx.prisma.notifyUser.findMany({
                        where: {userid: ctx.currentUser.session.userId },
                        cursor: cursor ?  { created_at_nofiy_user_id: cursor } : undefined,
                        orderBy: {created_at: 'desc'},
                        take: take+1,
                        
                    })
                    let nextCursor: typeof cursor | undefined;
                    if(notifcations.length > take){
                        const nextItem = notifcations.pop()
                        if(nextItem != null){
                        nextCursor = {nofiy_user_id: nextItem.nofiy_user_id, created_at: nextItem.created_at}
                    }
                    }                        
                    return {
                        notifcations,
                        nextCursor
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
            getUsersGeoData: privateProcedure
            .query( async({ ctx }) => {
                try{
                    const geoData = await ctx.prisma.geoUser.findFirst({
                        where: { userid: ctx.currentUser.session.userId },
                    })
                    return {
                        geoData
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            })
    
})