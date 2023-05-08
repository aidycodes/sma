import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import type { Post} from "@prisma/client"



export const feedRouter = createTRPCRouter({
    getFollowerFeed: privateProcedure
        .input(z.object({ postId: z.string(), page: z.number(), additional_websocket_items: z.array(z.string()) }))
        .query(async ({ input, ctx }) => {
            const user = ctx.currentUser.user.userId
            const { postId, page, additional_websocket_items } = input
                try{
                    const feed = await ctx. prisma.$queryRaw<{posts: Post[]}>(
        Prisma.sql`
            SELECT  "_UserFollows"."B", "_UserFollows"."A", content, "Post"."id", "Post"."userId", username
            FROM "_UserFollows"
            JOIN "Post" ON "Post"."userId" = "_UserFollows"."A"       
            JOIN "auth_user" ON "auth_user"."id" = "Post"."userId"
            WHERE "_UserFollows"."B" = ${user} 
            ORDER BY "Post"."createdAt" DESC
            OFFSET ${page} + ${additional_websocket_items.length} * 10
            LIMIT 10
            `
        )
                    return {
                        feed
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
        .input(z.object({ postId: z.string(), page: z.number(),  primary_location: z.string() }))
        .query(async ({ input, ctx }) => {
            const user = ctx.currentUser.user.userId
            const { postId, page, primary_location } = input
            const r = 10
                try{
                    const feed = await ctx. prisma.$queryRaw<{posts: Post[]}>(
        Prisma.sql`SELECT "auth_user"."id", "auth_user"."id", "GeoPost"."created_at", username, content, "GeoPost"."coords"::text 
                FROM "GeoPost" 
            RIGHT JOIN "auth_user" ON "GeoPost"."userid" = "auth_user"."id" 
            WHERE ST_DWithin("GeoPost"."coords"
            , ${primary_location}, ${r} * 1)
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
        .input(z.object({ postId: z.string(), page: z.number(),
             lat: z.number(), lng: z.number() }))
        .query(async ({ input, ctx }) => {
            const { postId, page, lat, lng } = input
             const feed = await ctx.prisma.$queryRaw<{ id: string }[]>(
            Prisma.sql`SELECT id, content, coords::text 
            FROM "GeoPost" 
            WHERE ST_DWithin(coords, ST_SetSRID(ST_Point(${lng}, ${lat}),4326), 50) 
                and ST_Distance(coords, ST_SetSRID(ST_Point(${lng}, ${lat}),4326)) > 1
            ORDER BY created_at desc
            OFFSET ${page} * 10
                ` )
            
                return {
                    feed
                }
                
            })

                
})