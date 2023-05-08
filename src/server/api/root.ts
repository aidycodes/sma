import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { commentRouter } from "./routers/comment";
import { userQueryRouter } from "./routers/userQuery";
import { followRouter } from "./routers/follows";
import { notifyRouter } from "./routers/notify";
import { geoPostRouter } from "./routers/geopost";
import { geoCommentRouter } from "./routers/geocomment";


export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  userQuery: userQueryRouter,
  follow: followRouter,
  notify: notifyRouter,
  geoPost: geoPostRouter,
  geoComment: geoCommentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
