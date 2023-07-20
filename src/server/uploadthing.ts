/** server/uploadthing.ts */
import { auth } from "auth/lucia";
import { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { prisma } from "./db";
const f = createUploadthing();
 
//const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image"])
    .maxSize("1GB")
    .middleware(async (req, res) => {
      // This code runs on your server before upload
          const authRequest = auth.handleRequest(req, res)
        const { user } = await authRequest.validateUser();
       
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
  
      const editProfile = await  prisma.userProfile.update({
            where: {
                userid: metadata.userId
            },
            data: {
                avatar: file.url
            }
        })

    }),
    postImageUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image"])
    .maxSize("1GB")
    .middleware(async (req, res) => {
      // This code runs on your server before upload
          const authRequest = auth.handleRequest(req, res)
        const { user } = await authRequest.validateUser();
       
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
     
    }),
    bannerUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image"])
    .maxSize("1GB")
    .middleware(async (req, res) => {
      // This code runs on your server before upload
          const authRequest = auth.handleRequest(req, res)
        const { user } = await authRequest.validateUser();
       
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
 
      const editProfile = await  prisma.userProfile.update({
            where: {
                userid: metadata.userId
            },
            data: {
                cover: file.url
            }
        })

    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;