// auth/lucia.ts
import lucia from "lucia-auth";
import { node } from "lucia-auth/middleware";
import prisma from "@lucia-auth/adapter-prisma";
//import { dev } from "$app/environment";
import redis from "@lucia-auth/adapter-session-redis";
import { prismaClient } from "~/server/db";
import { createClient } from "redis";
import { env } from "~/env.mjs";

export const sessionClient = createClient({url:env.REDIS_SESSION});
export const userSessionClient = createClient({url:env.REDIS_USER_SESSION});



export const auth = lucia({

        adapter:{
            user: prisma(prismaClient),
            session: redis({
                session: sessionClient,
            userSession: userSessionClient
            })
            
        },
	env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
	middleware: node()
});

export type Auth = typeof auth;