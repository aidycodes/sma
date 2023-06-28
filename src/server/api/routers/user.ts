import { z } from "zod";
import { auth } from "auth/lucia";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { createId } from '@paralleldrive/cuid2';

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation( async({ input, ctx  }) => {
      try{  
        const { email, password } = input;       
      const user = await auth.createUser({
	primaryKey: {
		providerId: "email", // provider id = authentication method
			providerUserId: email, // the user's username is unique to the user
			password: password
	},
    attributes: { email }
	
});
    const session = await auth.createSession(user.userId);
        const sessionCookie = auth.createSessionCookie(session).serialize();
         const token = jwt.sign({ user: user.userId }, 'secret')
        ctx.res.setHeader("Set-Cookie", [sessionCookie, 
            'wstoken='+token+'; path=/; expires=Thu, 01 Jan 2037 00:00:00 GMT;' ]);
      return {
        user
      };
    }catch(err){
        if(err instanceof Error){
       throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }
    }
    }),
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async({ input, ctx }) => {
      try{  
        const { email, password } = input;    
        const key = await auth.useKey("email", email, password);
		const session = await auth.createSession(key.userId);
		ctx.authRequest.setSession(session); // set cookie
         const sessionCookie = auth.createSessionCookie(session).serialize();
         
         const token = jwt.sign({ user: key.userId }, 'secret')

         ctx.res.setHeader("Set-Cookie", [sessionCookie, 
            'wstoken='+token+'; path=/; expires=Thu, 01 Jan 2037 00:00:00 GMT;' ]);

          return {
            session
          }
    }catch(err){
        if(err instanceof Error){
       throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }
    }
    }),
  logout: privateProcedure
    .mutation(async({ input, ctx }) => {
        try{
        const loggedout = await auth.invalidateSession(ctx.currentUser.session.sessionId);
         ctx.res.setHeader("Set-Cookie", ['auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
         'wstoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;']);
        return {
            loggedout
        }
    }catch(err){
        if(err instanceof Error){
       throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }
    }
    }),
  updateProfile: privateProcedure.
    input(z.object({bio: z.optional(z.string()), work: z.optional(z.string()), username: z.string(),
         education: z.optional(z.string()), avatar: z.optional(z.string()), cover: z.optional(z.string()),  }))
    .mutation(async({ input, ctx }) => {
      try{
        const profile = await ctx.prisma.userProfile.update({
            where: {userid: ctx.currentUser.user.userId},
            data: 
                input
        })
        return {
            profile
        }
    }catch(err){
        if(err instanceof Error){
       throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }
    }
    }),
  updateUser: privateProcedure.
    input(z.object({username: z.optional(z.string()), email: z.optional(z.string()),
         theme: z.optional(z.string()), primary_lang: z.optional(z.string())  }))
    .mutation(async({ input, ctx }) => {
      try{
        const profile = await ctx.prisma.authUser.update({
            where: {id: ctx.currentUser.user.userId},
            data: 
                input
        })
        return {
            profile
        }
    }catch(err){
        if(err instanceof Error){
       throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }
    }
    }),
  createProfile: privateProcedure.
    input(z.object({ username: z.string()}))
    .mutation(async({ input, ctx }) => {
      try{
        const profile = await ctx.prisma.authUser.update({
            where: {id: ctx.currentUser.user.userId},
            data: {
              profile:{
                create: {
                  username: input.username,
              }
               
            }
          }
        })
        return {
          profile
        }
      } catch(err){
        if(err instanceof Error){
       throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }}
    }),
  createGeoUser: privateProcedure.
    input(z.object({ lat: z.number(), lng: z.number(), country: z.optional(z.string()), 
      city: z.optional(z.string()), county: z.optional(z.string()), state: z.optional(z.string()) }))
    .mutation(async({ input, ctx }) => {
      try{
        const {lat, lng, country, city, county, state} = input
          const newId = createId()
          const userid = ctx.currentUser.user.userId
   
      const geoUser = await ctx.prisma.$queryRaw<{id: string}>(
      Prisma.sql`INSERT INTO "geo_user" (id, userid, city, country, county, lat, lng, state, primary_location )
                VALUES (${newId}, ${userid}, ${city}, ${country},
                ${county}, ${lat}, ${lng}, ${state},
                ST_SetSRID(ST_Point(${lng}, ${lat}),4326))
                RETURNING id`
          )
            return {
              geoUser
            }
      } catch(err){
        if(err instanceof Error){
        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }}
    }),
  updateGeoUser: privateProcedure.
    input(z.object({ lat: z.number(), lng: z.number(), country: z.optional(z.string()), 
      city: z.optional(z.string()), county: z.optional(z.string()), state: z.optional(z.string()) }))
    .mutation(async({ input, ctx }) => {
      try{
        const {lat, lng, country, city, county, state} = input
          const userid = ctx.currentUser.user.userId
   
      const geoUser = await ctx.prisma.$executeRaw<{county: string}>(
      Prisma.sql`UPDATE "geo_user"
      SET county = ${county}, city = ${city}, country = ${country}, state = ${state}, 
      lat = ${lat}, lng = ${lng}, primary_location = ST_SetSRID(ST_Point(${lng}, ${lat}),4326)   
      WHERE "userid" = ${userid}`
          )
            return {
              geoUser
            }
      } catch(err){
        if(err instanceof Error){
        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }}
    }),
  updateTheme: privateProcedure.
    input(z.object({ theme: z.string() }))
    .mutation(async({ input, ctx }) => {
      try{
        const { theme } = input
          const userid = ctx.currentUser.user.userId
          const updated = await ctx.prisma.userProfile.update({
            where: {userid},
            data: {
              theme
            }
          })
            return {
              updated
            }
      } catch(err){
        if(err instanceof Error){
        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
        } else {
            console.log('unexpected error', err)
        }}
    }),

    checkEmail: publicProcedure.
    input(z.object({ email: z.string() }))
    .query(async({ input, ctx }) => {
      try{
        const { email } = input
          const user = await ctx.prisma.authUser.findUnique({where: {email}})
          if(user) {
            return { 
              emailIsUsed:true
            }
            
          } else {
            return {
            emailIsUsed: false
            }
          }
        } catch(err){
          if(err instanceof Error){
          throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
          } else {
              console.log('unexpected error', err)
          }}
    }),

  isAuthed: privateProcedure.query(async({ ctx }) => {
    if(ctx.currentUser){
    const user = await ctx.prisma.authUser.findUnique({where: {id: ctx.currentUser.user.userId}})
    return {
      user
    }
  }})
});
