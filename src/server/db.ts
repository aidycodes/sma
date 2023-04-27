import { PrismaClient } from "@prisma/client";
import { sessionClient, userSessionClient } from "auth/lucia";
import { env } from "~/env.mjs";

//connect to redis
( async() => {
  try{
    await userSessionClient.connect()
    await sessionClient.connect()
  }catch(e){
    console.log(e)
  }
}
  )()
//initialize prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;
