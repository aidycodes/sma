import React from 'react'
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import pkg from 'react-dropzone'
 
import type { OurFileRouter } from "~/server/uploadthing";
import { UserProfile } from '@prisma/client';
import Image from 'next/image';

const Images = ( user: UserProfile) => {

  const {avatar, cover} = user

  console.log({avatar})

  return (
    <div className="fg p-8 rounded-md shadow-md mt-12">
        <h1 className="text-center pb-4 font-semibold tracking-widest">Profile Images</h1>
      <div>  
        <h2 className="font-semibold tracking-widest pb-4">Avatar</h2>
      
        <div className="pb-10 flex gap-8 items-center">
        <Image src={avatar ? avatar : '/icons/user.svg'} alt="avatar" width={60} height={60} className=" w-20 h-20 rounded-full"/>
                 <UploadButton<OurFileRouter>
        endpoint="avatarUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      
      </div>
    </div>
        
        <h2 className="font-semibold tracking-widest pb-4">Banner</h2>
        {!cover ? <div className="text-center w-80 h-20 mb-4 font-semibold ">No banner uploaded</div> :
        <img src={cover} alt="avatar" width={80} height={60} className=" w-80 h-20 mb-4 "/>
}
                   <UploadButton<OurFileRouter>
        endpoint="bannerUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      <div className="pb-10"></div>


    </div>
  )
}

export default Images