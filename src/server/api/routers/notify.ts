import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const notifyRouter = createTRPCRouter({

    hasViewed: privateProcedure
        .input(z.object({ notify_user_id: z.string()}))
        .mutation(async ({ input, ctx }) => {
                try{ 
                    const notify = await ctx.prisma.notifyUser.update({
                        where: { nofiy_user_id: input.notify_user_id },
                        data: {
                            viewed:true
                        }
                    })
                     return {
                     notify
                    }
                    }catch(err){
                        if(err instanceof Error){
                    throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                        } else {
                            console.log('unexpected error', err)
                        }}
                })
})