import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import type { Post} from "@prisma/client"



export const feedRouter = createTRPCRouter({
    getFollowerFeed: privateProcedure
        .input(z.object({ postAmt:z.number(),
             cursor: z.object({created_at: z.date(), postid: z.string()}).optional() }))
        .query(async ({ input, ctx }) => {
            const user = ctx.currentUser.user.userId
            const { cursor, postAmt } = input
                try{
                    const following = await ctx.prisma.authUser.findFirst({
                        where: {
                            id: user,
                        },
                        select: {
                            follows: {
                                select: {
                                    id: true,
                    
                        }}}
                    }) 
                    const feed = await ctx.prisma.post.findMany({
                        where:{
                            user:{
                                id: { in: following?.follows.map((user) => user.id) },
                            }
                        },
                        take: postAmt + 1,
                        cursor: cursor ? {created_at_postid: cursor } : undefined,
                        include: {
                            user: {
                                select:{
                                    profile:true,
                                    id: true,
                                }
                            },
                            likes: {
                                include:{
                                    user: {
                                        select:{
                                            profile:true,
                                            id: true,
                                        }
                                    }
                                }
                            },
                            comments: {
                                orderBy: {
                                    created_at: "asc",
                                },
                                include:{
                                    user: {
                                        select: {
                                            id: true,
                                            profile: true,
                                        }
                                    },
                                    likes:{
                                        include:{
                                            user:{ 
                                            select:{
                                                profile:true,
                                                id: true,
                                            }}
                                    }},
                            },
                            
                        }},
                        orderBy: {
                            created_at: "desc",
                        },
                      
                    })

                let nextCursor: typeof cursor | undefined;
                    if(feed.length > postAmt){
                        const nextItem = feed.pop()
                        if(nextItem != null){
                        nextCursor = {created_at: nextItem.created_at, postid: nextItem.postid}
                    }
                }
                    return {
                        nextCursor,
                        posts: feed
                    }
                }catch(err){
                    if(err instanceof Error){
                 throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }}
                }
        ),
    getGeoInnerFeed_primary: privateProcedure
        .input(z.object({ page: z.number(),  lat: z.number(), lng: z.number() }))
        .query(async ({ input, ctx }) => {
            const user = ctx.currentUser.user.userId
            const {  page, lat, lng } = input
            const r = 10
                try{
                    const feed = await ctx. prisma.$queryRaw<{posts: Post[]}>(
        Prisma.sql`SELECT "auth_user"."id", "geo_post"."created_at", username, content, "geo_post"."coords"::text 
                FROM "geo_post" 
            RIGHT JOIN "auth_user" ON "geo_posts"."userid" = "auth_user"."id" 
            WHERE ST_DWithin("geo_post"."coords"
            , ST_SetSRID(ST_Point(${lng}, ${lat}),4326), ${r} * 1)
            ORDER BY created_at desc
            OFFSET ${page}* 10
            `) 
                return {
                        feed
                    }
            }catch(err){
                    if(err instanceof Error){
                 throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }}
                }),
    getGeoOutterFeed_primary: privateProcedure
        .input(z.object({ postId: z.string(), page: z.number(), primary_location: z.string() }))
                   .query(async ({ input, ctx }) => {
            const user = ctx.currentUser.user.userId
            const { postId, page, primary_location } = input
                try{
                    const feed = await ctx.prisma.$queryRaw<{posts: Post[]}>(
         Prisma.sql`SELECT id, content, geo_location::text 
            FROM "GeoPost" 
            WHERE ST_DWithin(geo_location, ${primary_location}, 50) 
                and ST_Distance(geo_location, ${primary_location}) > 1
            ORDER BY created_at desc
            OFFSET ${page} * 10
            `) 
                return {
                        feed
                    }
            }catch(err){
                    if(err instanceof Error){
                 throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }}
                }),
    getGeoFeed_current: privateProcedure
        .input(z.object({ cursor:z.object({created_at_postid:z.string()}).optional(),
             lat: z.number(), lng: z.number() }))
        .query(async ({ input, ctx }) => {
            const { cursor, lat, lng } = input

            const cursorDate = cursor ? cursor.created_at_postid : '0'
            console.log(cursorDate)
            let feed 
            if(cursor){
              feed = await ctx.prisma.$queryRaw<{ postid: string, created_at_postid: string }[]>(
            Prisma.sql`SELECT postid, geo_post.userid, content, geo_location::text, created_at_postid, timestamp, created_at
            FROM "geo_post" 
            WHERE ST_DWithin(geo_location, ST_SetSRID(ST_Point(${lng}, ${lat}),4326), 5)
              AND created_at_postid <= ${cursorDate}
            ORDER BY created_at_postid desc
            LIMIT 6   
                ` )
             } else {
                   feed = await ctx.prisma.$queryRaw<{ postid: string, created_at_postid: string }[]>(
            Prisma.sql`SELECT postid, geo_post.userid, content, geo_location::text, created_at_postid, timestamp, created_at
            FROM "geo_post" 
            WHERE ST_DWithin(geo_location, ST_SetSRID(ST_Point(${lng}, ${lat}),4326), 5)
              AND created_at_postid > '0'
            ORDER BY created_at_postid desc
            LIMIT 6 `)

             }
 
                let nextCursor: typeof cursor | undefined;
                    if(feed.length > 5){
                        const nextItem = feed.pop()
                        if(nextItem != null){                     
                        nextCursor = {created_at_postid: nextItem.created_at_postid}
                    }
                }

                const posts = await ctx.prisma.geo_Post.findMany({
                    where: {
                        postid: { in: feed.map(({ postid }) => postid )},
                    },
                    include: {                       
                        user: {
                            select: {
                                profile: true,
                                id: true,
                            }
                        },
                        likes: {
                            include: {
                                user: {
                                    select: {
                                        profile: true,
                                        id: true,
                                    }
                                }
                            }
                        },
                        comments: {
                            orderBy:{
                                created_at: "asc",
                            },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        profile: true,
                                    }
                                },
                                likes: {
                                    include: {
                                        user: {
                                            select: {
                                                profile: true,
                                                id: true,
                                            }
                                        }
                                    }
                                },
                            },
                        },
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                })
   
                return {
                    nextCursor,
                    posts
                }
                
            }),
 
})


//and ST_Distance(geo_location, ST_SetSRID(ST_Point(${lng}, ${lat}),4326)) > 100