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
                    const user = await ctx.prisma.authUser.findUnique({where: {id: userId},
                        select:{followers_cnt:true, created_at:true, profile:true, follows: { select: {
                            profile: true }
                        }} //follows was added 
                    });
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
                    const user = await ctx.prisma.authUser.findUniqueOrThrow({where: {id: id},
                      select:{followers_cnt:true, created_at:true, profile:true}
                    });
                    return {
                        followers_cnt:user.followers_cnt,
                        created_at:user.created_at,
                        ...user.profile
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
            .input(z.object({id: z.string(), postAmt:z.number(), cursor: z.object({created_at: z.date(), postid: z.string()}).optional()}))
            .query( async({ input: {id, postAmt, cursor}, ctx }) => {  
                try{
                 
                    const posts = await ctx.prisma.post.findMany({
                        where: {userid: id},
                        orderBy: {created_at: 'desc'},
                        take:postAmt + 1,
                        cursor: cursor ? {created_at_postid: cursor } : undefined,
                        include: {
                            user: {
                                select: {followers_cnt:true, following_cnt:true, profile:true}},
                            comments: {
                               
                            include: {user: {
                                select:{
                                    profile:{
                                        select:{
                                            avatar:true, username:true, userid:true}
                                    }
                                }
                            }, likes:{
                                select: {user: {
                                    select:{
                                        username:true, id:true}}
                                    },
                            }},
                            orderBy: {created_at: 'asc'},         
                        },
                        likes:{
                            select: {user: {
                                    select:{
                                        profile:{
                                            select:{
                                                avatar:true, username:true, userid:true}
                                            }
                                        }
                                    }
                                }
                                }
                        }
                    })

                    let nextCursor: typeof cursor | undefined;
                    if(posts.length > postAmt){
                        const nextItem = posts.pop()
                        if(nextItem != null){
                        nextCursor = {created_at: nextItem.created_at, postid: nextItem.postid}
                    }
                    }
                     return {           
                        posts,
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
        searchUsersFollowers: privateProcedure
            .input(z.object({searchTerm: z.string()}))
            .query( async({ input, ctx }) => {
                try{
                    const { searchTerm } = input;
                    const users = await ctx.prisma.authUser.findUnique({
                        where: {id: ctx.currentUser.session.userId},
                        select: {follows: {
                            where: {username: {contains: searchTerm}},
                            select: {profile: true}}}
                    })
                    return {
                        users
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
            }),
            deleteNotifications: privateProcedure
            .mutation( async({ ctx }) => {
                try{
                    const deleted = await ctx.prisma.notifyUser.deleteMany({
                       
                    })
                    return {
                        deleted
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