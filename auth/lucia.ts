// auth/lucia.ts
import lucia from "lucia-auth";
import { node } from "lucia-auth/middleware";
import prismaLucia from "@lucia-auth/adapter-prisma";
import redis from "@lucia-auth/adapter-session-redis";
import { prisma } from "~/server/db";
import { createClient } from "redis";
import { env } from "~/env.mjs";
import "lucia-auth/polyfill/node";

export const sessionClient = createClient({url:env.REDIS_SESSION});
export const userSessionClient = createClient({url:env.REDIS_USER_SESSION});
sessionClient.connect()
userSessionClient.connect()


export const auth = lucia({

        adapter:{
            user: prismaLucia(prisma),
            session: redis({
                session: sessionClient,
            userSession: userSessionClient
            })
            
        },
	env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
	middleware: node()
});

export type Auth = typeof auth;