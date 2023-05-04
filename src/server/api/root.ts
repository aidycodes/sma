import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { commentRouter } from "./routers/comment";
import { userQueryRouter } from "./routers/userQuery";
import { followRouter } from "./routers/follows";
import { notifyRouter } from "./routers/notify";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  userQuery: userQueryRouter,
  follow: followRouter,
  notify: notifyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
