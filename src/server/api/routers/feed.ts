import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Geo_Post, Prisma } from "@prisma/client";
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
    getGeoFeed_current: privateProcedure
        .input(z.object({ cursor:z.object({created_at_postid:z.string()}).optional(),
             lat: z.number(), lng: z.number(), radius: z.number() }))
        .query(async ({ input, ctx }) => {
            const { cursor, lat, lng, radius } = input

            const cursorDate = cursor ? cursor.created_at_postid : '0'
            console.log(cursorDate)
            const milesMeters = Math.floor(1610.34 * radius)
            console.log({milesMeters, lat, lng})
            let feed 
            if(cursor){ 
              feed = await ctx.prisma.$queryRaw<{ postid: string, created_at_postid_raw: string }[]>(
            Prisma.sql`SELECT postid, geo_post.userid, content, geo_location::text, created_at_postid_raw, timestamp, created_at
            FROM "geo_post" 
            WHERE ST_DWithin(st_transform(geo_location, 3857), st_transform(ST_SetSRID(ST_Point(${lng}, ${lat}),4326), 3857), ${milesMeters})
              AND created_at_postid_raw <= ${cursorDate}
            ORDER BY created_at_postid_raw desc
            LIMIT 6   
                ` )
             } else {
                   feed = await ctx.prisma.$queryRaw<{ postid: string, created_at_postid_raw: string }[]>(
            Prisma.sql`SELECT postid, geo_post.userid, content, geo_location::text, created_at_postid_raw, timestamp, created_at
            FROM "geo_post" 
            WHERE ST_DWithin(st_transform(geo_location, 3857), st_transform(ST_SetSRID(ST_Point(${lng}, ${lat}),4326), 3857), ${milesMeters})
              AND created_at_postid_raw > '0'
            ORDER BY created_at_postid_raw desc
            LIMIT 6 `)

             }
 
                let nextCursor: typeof cursor | undefined;
                    if(feed.length > 5){
                        const nextItem = feed.pop()
                        if(nextItem != null){                     
                        nextCursor = {created_at_postid: nextItem.created_at_postid_raw}
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
         getGeoFeed_home: privateProcedure
        .input(z.object({ cursor:z.object({created_at_postid:z.string()}).optional(),
             lat: z.number(), lng: z.number(), radius: z.number() }))
        .query(async ({ input, ctx }) => {
            const { cursor, lat, lng, radius } = input

            const cursorDate = cursor ? cursor.created_at_postid : '0'
            console.log(cursorDate)
            const milesMeters = Math.floor(1610.34 * radius)
            console.log({milesMeters, lat, lng})
            let feed 
            if(cursor){
              feed = await ctx.prisma.$queryRaw<{ postid: string, created_at_postid_raw: string }[]>(
            Prisma.sql`SELECT postid, geo_post.userid, content, geo_location::text, created_at_postid_raw, timestamp, created_at
            FROM "geo_post" 
            WHERE ST_DWithin(st_transform(geo_location, 3857), st_transform(ST_SetSRID(ST_Point(${lng}, ${lat}),4326), 3857), ${milesMeters})
              AND created_at_postid_raw <= ${cursorDate}
            ORDER BY created_at_postid_raw desc
            LIMIT 6   
                ` )
             } else {
                   feed = await ctx.prisma.$queryRaw<{ postid: string, created_at_postid_raw: string }[]>(
            Prisma.sql`SELECT postid, geo_post.userid, content, geo_location::text, created_at_postid_raw, timestamp, created_at
            FROM "geo_post" 
            WHERE ST_DWithin(st_transform(geo_location, 3857), st_transform(ST_SetSRID(ST_Point(${lng}, ${lat}),4326), 3857), ${milesMeters})
              AND created_at_postid_raw > '0'
            ORDER BY created_at_postid_raw desc
            LIMIT 6 `)

             }
 
                let nextCursor: typeof cursor | undefined;
                    if(feed.length > 5){
                        const nextItem = feed.pop()
                        if(nextItem != null){                     
                        nextCursor = {created_at_postid: nextItem.created_at_postid_raw}
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

            getActivityFeed: privateProcedure
            .input(z.object({ cursor:z.object({
                geoCursor:z.object({created_at: z.date(), postid: z.string(), skip: z.boolean().optional() }).optional(),
                postCursor:z.object({created_at: z.date(), postid: z.string(), skip: z.boolean().optional() }).optional(),
                }).optional()}))                
                .query(async ({ input, ctx }) => {
                const { cursor: cursorInput } = input

        let geoPosts: any[] = []
        let feed: any[] = []
            if(!cursorInput?.postCursor?.skip){     
                 feed = await ctx.prisma.post.findMany({
                    where:{
                        
                        OR:[
                            { comments: { some: { userid: ctx.currentUser.user.userId } } },
                               {userid: ctx.currentUser.user.userId}]
                            },
                        take: 11,
                        cursor: cursorInput ? {created_at_postid: cursorInput.postCursor } : undefined,
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
            }

                  if(!cursorInput?.geoCursor?.skip){    
                          geoPosts = await ctx.prisma.geo_Post.findMany({
                    where:{
                        
                        OR:[
                            { comments: { some: { userid: ctx.currentUser.user.userId } } },
                               {userid: ctx.currentUser.user.userId}]
                            },
                        take: 11,
                        cursor: cursorInput?.geoCursor ? {created_at_postid: cursorInput?.geoCursor } : undefined,
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
                }
    const posts: any = [...feed, ...geoPosts]
            .sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf() ).slice(0, 10)
   
            const lastGeoPost = posts.findLast((item: any) => item.type === "geo")
    const lastPost = posts.findLast((item: any) => !item.type)
    
    const lastGeoIndex = geoPosts.findIndex((item: any, i: number) =>  item.postid === lastGeoPost.postid)
    const geoItem = geoPosts[lastGeoIndex + 1]

    const lastPostIndex = feed.findIndex((item: any, i: number) =>  item.postid === lastPost.postid)
    const postItem = feed[lastPostIndex + 1]

    const geoCursor = geoItem ? {created_at: geoItem.created_at, postid: geoItem.postid} : {created_at: new Date(), postid:'skip', skip: true}
    const postCursor =  postItem ? {created_at: postItem.created_at, postid: postItem.postid} : {created_at: new Date(), postid:'skip', skip: true}
    const cursor = !geoCursor.skip || !postCursor.skip ? {geoCursor, postCursor} : undefined
            console.log({geoCursor})
                    return {
                        posts,
                        cursor                
                    }
            }),





 
})

