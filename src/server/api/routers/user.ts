import { z } from "zod";
import { auth } from "auth/lucia";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { AuthRequest, Session } from "lucia-auth";
import { TRPCError } from "@trpc/server";


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
        ctx.res.setHeader("Set-Cookie", sessionCookie);
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
          ctx.res.setHeader("Set-Cookie", sessionCookie);
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
         ctx.res.setHeader("Set-Cookie", 'auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;');
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
    input(z.object({bio: z.optional(z.string()), work: z.optional(z.string()),
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
  isAuthed: privateProcedure.query(async({ ctx }) => {
    if(ctx.currentUser){
    const user = await ctx.prisma.authUser.findUnique({where: {id: ctx.currentUser.user.userId}})
    return {
      user
    }
  }})
});
