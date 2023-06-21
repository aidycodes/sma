import { UploadDropzone, UploadButton } from '@uploadthing/react';
import React from 'react'
import { toast } from 'react-hot-toast';
import { OurFileRouter } from '~/server/uploadthing';
import FakeUploader from './fakeupload';
import { ImageUploader } from './imageUploader';


const ImageUpload = ({ setValue, isDisabled = false }:
   { setValue: any, isDisabled: boolean }) => {

    if(isDisabled) return (
      <div className="h-14" >
          <div className="relative blur-[2px] ">
        <FakeUploader/>    
    </div>
    <span className="text-sm h-2">Images are disabled while backgrounds are selected</span>
    </div>
    )

  return (
  
    <div className="h-14 overflow-hidden">
      <ImageUploader setValue={setValue}/>

    </div>
  )
}

export default ImageUpload