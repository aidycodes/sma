import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const userQueryRouter = createTRPCRouter({
    getUserProfile: publicProcedure
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
            .query( async({ input, ctx }) => {
                try{
                    const notifcations = await ctx.prisma.notifyUser.findMany({
                        where: {userid: ctx.currentUser.session.userId },
                        orderBy: {created_at: 'desc'},
                        take: 10
                    })
                    return {
                        notifcations
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
    
})