import React from 'react'
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import type { OurFileRouter } from "~/server/uploadthing";
import { UserProfile } from '@prisma/client';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { fileURLToPath } from 'url';


const ImageUpload = z.array(z.object({fileKey: z.string(), fileUrl: z.string()}))

type ImageUpload = z.infer<typeof ImageUpload>

const Images = ( user: UserProfile) => {

  const {avatar, cover} = user

  const [avatarImg, setAvatarImg] = React.useState<string | null>(avatar)
  const [coverImg, setCoverImg] = React.useState<string | null>(cover)

  console.log({avatar})
  const { theme } = useTheme()


  return (
    <div className="fg p-8 rounded-md shadow-md mt-12">
        <h1 className="text-center pb-4 font-semibold tracking-widest">Profile Images</h1>
      <div>  
         <div className={`${theme === 'light' || theme === 'lightFix' || theme === 'lightFix' || theme === 'neon' || theme === 'neonFix' || theme === 'neonFix' ? 'sticky2' :
           theme === 'dark-blue' || theme === 'dark-blueFix' || theme === 'dark-blueFix' ? 'highlight-1 border-blue-600 border-2 '    
         :'sticky-dark'} 
                          rounded-xl p-4 shadow-lg mt-2`}>
        <h2 className="font-semibold tracking-widest pb-4">Avatar</h2>   
        <div className="pb-10 flex gap-8 items-center">
          
        <Image unoptimized src={avatarImg ? avatarImg : '/icons/user.svg'} alt="avatar" width={60} height={60} className=" w-20 h-20 rounded-full"/>
          <UploadButton<OurFileRouter>
        endpoint="avatarUploader"
        onClientUploadComplete={(res) => {    
          if(res){
            const data = res[0]
            setAvatarImg(data ? data.fileUrl : '/icons/user.svg')
              toast.success('Upload Completed')
          }         
        }}
        onUploadError={(error: Error) => {
          toast.error('Upload Failed')
        }}
      />
    </div>  
      </div>
    </div>
         <div className={`${theme === 'light' || theme === 'lightFix' || theme === 'neon' || theme === 'neonFix' ? 'sticky2' : 
          theme === 'dark-blue' || theme === 'dark-blueFix' ? 'highlight-1 border-blue-600 border-2 ' :
         'sticky-dark'} 
                          rounded-xl p-4 shadow-lg mt-6`}>      
        <h2 className="font-semibold tracking-widest pb-4 ">Banner</h2>

        {!coverImg ? <div className="text-center w-80 h-20 mb-4 font-semibold  ">No banner uploaded</div> :
        <Image unoptimized src={coverImg} alt="avatar" width={80} height={60} className=" w-80 h-20 mb-4 "/>
}
                   <UploadButton<OurFileRouter>
        endpoint="bannerUploader"
        onClientUploadComplete={(res) => {
          if(res){
            const data = res[0]
          setCoverImg(data ? data.fileUrl : null)
          toast.success('Upload Completed')
          }
        }}
        onUploadError={(error: Error) => {
          toast.error('Upload Failed')
        }}
      />
      <div className=""></div>
</div>

    </div>
  )
}

export default Images