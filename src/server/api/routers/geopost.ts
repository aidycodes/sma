import { z } from "zod";
import { auth } from "auth/lucia";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { AuthRequest, Session } from "lucia-auth";
import { TRPCError } from "@trpc/server";


export const geoPostRouter = createTRPCRouter({
})