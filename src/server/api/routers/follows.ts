import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const followRouter = createTRPCRouter({
    isFollowerFollowing: privateProcedure
            .input(z.object({id: z.string()}))
            .query( async({ input, ctx }) => {
                try{
                    const { id } = input;
                    const [follower, following] = await Promise.all([
                        ctx.prisma.authUser.findMany({where: {id: id},
                        select: {
                            follows: {
                                where: {
                                    id: ctx.currentUser.user.userId}}
                            
                        }
                    }),
                        ctx.prisma.authUser.findMany({where: {id: ctx.currentUser.user.userId},
                        select: {
                            follows: {                               
                            where: {
                                id: id}
                        }}
                    })
                ])           
                            if(follower[0] && following[0]){
                    return {
                        followsUser: follower[0].follows.length === 0 ? false : true,
                        userFollows: following[0].follows.length === 0 ? false : true
                }  
            } else {
                return {
                    followsUser: false,
                    userFollows: false
                }
            }
            }catch(err){
                if(err instanceof Error){
                    throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                } else {
                    console.log('unexpected error', err)
                }}
            }),
            followUser: privateProcedure
            .input(z.object({id: z.string(), currentUser: z.string()}))
            .mutation( async({ input, ctx }) => {
                try{
                    const { id, currentUser } = input;

                const [follows, follower] = await Promise.all([
                        ctx.prisma.authUser.update({
                            where: {id: ctx.currentUser.user.userId},
                            data: {follows: {connect: {id: id}
                        }, following_cnt: {increment: 1} }
                        }),
                        ctx.prisma.authUser.update({
                            where: {id: id},
                            data: {followers: {connect: {id: ctx.currentUser.user.userId}
                            
                        }, followers_cnt: {increment: 1},
                            
                            notifications: {create: {content: `${currentUser} started following you!` }}
                    }
                        })
                ])
                    return {
                        follows
                    }
                        }catch(err){
                            if(err instanceof Error){
                                throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                            } else {
                                console.log('unexpected error', err)
                            }
                        }
            }),
            unfollowUser: privateProcedure
            .input(z.object({id: z.string()}))
            .mutation( async({ input, ctx }) => {
                try{
                    const { id } = input;
                    const [follows, follower] = await Promise.all([
                        ctx.prisma.authUser.update({
                            where: {id: ctx.currentUser.user.userId},
                            data: {follows: {disconnect: {id: id}
                        }, following_cnt: {decrement: 1} }
                        }),
                        ctx.prisma.authUser.update({
                            where: {id: id},
                            data: {followers: {disconnect: {id: ctx.currentUser.user.userId}
                            
                        }, followers_cnt: {decrement: 1}
                    }
                        })
                ])
                    return {
                        follows
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