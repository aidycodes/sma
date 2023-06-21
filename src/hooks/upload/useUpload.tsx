import { generateReactHelpers } from "@uploadthing/react/hooks";
 
import { OurFileRouter } from '~/server/uploadthing';
 
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();