import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";


export const geoPostRouter = createTRPCRouter({
    create: privateProcedure
        .input(z.object({ title: z.string(), content: z.string(),
            lat: z.number(), lng: z.number(),
            meta: z.optional(z.object({})), type: z.string(), tags: z.optional(z.array(z.string())),
        })
        ).mutation(async ({ input, ctx }) => {
            const newId = createId()  //new cuid
             try{
                const {content, type, lat, lng, } = input 
                // const lat = 38.8951
                // const lng = -77.0364                           //this needs to be changed for correct outputs
                const metaData = {meta:'hello'}
                const title = 'hello'
                const cursorField = Date.now() + newId
              

            //sql query to insert a geopost into the database
            const query = await ctx.prisma.$queryRaw<{ postid: string }[]>(
            Prisma.sql`INSERT INTO "geo_post" (postid, title, content, type, meta, updated_at, geo_location, timestamp, created_at_postid, "userid")
                VALUES (${newId}, ${title}, ${content}, ${type}, ${metaData}, ${new Date()}, ST_SetSRID(ST_Point(${lng}, ${lat}),4326), ${Date.now()}, ${cursorField}, ${ctx.currentUser.user.userId})
                RETURNING postid`)

                return {
                    query
                }
            }catch (err) {
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
            const { postid } = input
            const deleted = await ctx.prisma.geo_Post.delete({
                where: {
                    postid: postid
                }
            })
            return {
                deleted
            }
        } catch (err) {
             if(err instanceof Error){
               throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                } else {
                    console.log('unexpected error', err)
                }}
        }),
    edit: privateProcedure
        .input(z.object({ postid: z.string().cuid2(), title:z.string(), content: z.string(), 
            type: z.optional(z.string()), meta:z.optional( z.object({ url: z.string() }))}))
        .mutation(async ({ input, ctx }) => {
           try{ 
            const { postid, title, content, type, meta } = input
            console.log({meta})
            const query = await ctx.prisma.geo_Post.update({
                where: {
                    postid
                },
                data: {
                    title,
                    content,
                    type,
                    meta: meta
                }})
            return {
                query
            }
        }catch (err) {
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
            const [liked, notify_user] = await Promise.all([ ctx.prisma.geo_Post.update({
                where: {
                    postid
                },
                data: {
                    likes_cnt: {
                        increment: 1
                    },
                    likes:{
                        create:{ postid: postid, userid: ctx.currentUser.user.userId, 
                            postid_userid: `${postid}_${ctx.currentUser.user.userId}`  } 
                    }
                }
            }),
            ctx.prisma.notifyUser.create({
                data: {
                    userid: userid,
                    type: 'like',
                    content: `${currentUser} liked your post!`,
                    relativeId: postid,
                }
            })
        ])
            return {
                liked
            }
        } catch (err) {
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
            const { postid } = input
            const unliked = await ctx.prisma.geo_Post.update({
                where: {
                    postid
                },
                data: {
                    likes_cnt: {
                        decrement: 1
                    },
                    likes:{
                        deleteMany: { postid_userid: `${postid}_${ctx.currentUser.user.userId}` }
                    }
                }
            })       
            return {
                unliked
            }
        }   
        catch (err) {
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
                const post = await ctx.prisma.geo_Post.findUnique({
                 where: { postid: input.postid },
                    include: { user: {
                                select: { username: true, profile: true },
                    },
                         likes: {
                                include: { user: {
                                    select: { username: true, profile: true },
                                } },
                                },
                          comments: {
                                include: { user: {
                                    select: { username: true, profile: true },
                                }, likes: {
                                    include: { user: {
                                        select: { username: true, profile: true },
                                    } },
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

