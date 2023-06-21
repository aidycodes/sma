import { useDropzone } from "react-dropzone";
import type { FileWithPath } from "react-dropzone";
import { useUploadThing } from "~/hooks/upload/useUpload";
import { useCallback, useState, useEffect } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import Loading from "~/components/loading";
import { toast } from "react-hot-toast";
import Image from "next/image";
 

export function ImageUploader({ setValue }: { setValue: any }) {
  const [files, setFiles] = useState<any[]>([]);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [readyToUpload, setReadyToUpload] = useState(true);
 
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image'])
  });
 
  const { startUpload, isUploading } = useUploadThing({
    endpoint: "postImageUploader", 
    onClientUploadComplete: (res) => {
        setHasUploaded(true);
        setValue('image', res[0].fileUrl)
        setReadyToUpload(false)
        console.log({res})
    },
    onUploadError: () => {
      toast.error("upload failed");
    },
  });

  const handleRemoveImage = () => {
    setFiles([])
    setHasUploaded(false)
    setValue('image', '')
    setReadyToUpload(true)
    }

  useEffect(() => {
    if(files.length > 0 && readyToUpload){
    startUpload(files)
    }
    }, [files])
 
  return (
    <div  >
       {hasUploaded ?  
    <div className="flex items-center justify-between">
        <div className="flex items-center ml-auto mr-auto">
        <Image src="icons/tick.svg" width={50} height={50} alt="tick" />
        <h2>Image</h2>
        </div>
        <div className="m-2 mr-4 flex flex-col justify-center hover:brightness-200 text-slate-300 cursor-pointer" onClick={() => handleRemoveImage()}>
       <button className="  rounded-md hover:brightness-200 text-slate-300 text-xl">X</button>
       <span className="text-xs">remove</span> 
        </div>
    </div>
    :
    <div>
      <input type="file" id="files" className={`outline-none border-none`} onChange={(e) => e.target.files && setFiles([...files, e.target.files[0]]) }   />
    </div>}
      <div>
      
        {isUploading && (
          <div className="pb-4">
          <Loading/>
          </div>
        )}
      </div>
    
    </div>
  );
}

export default ImageUploader