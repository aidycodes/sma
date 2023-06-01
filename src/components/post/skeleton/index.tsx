import React from 'react'



const PostSkeleton = () => {

  return (
    <div className="fg m-8 rounded-xl dbo-border animate-pulse pb-8 ">
                                         {/*heading component*/}
        <div className="fg rounded-xl">
            <div className="flex p-4 gap-2">
              <span className="skeleton-box w-14 h-14 rounded-[150px]"></span>

            <div className="flex flex-col gap-2 justify-center">
                <span className="skeleton-box w-32 h-4 rounded-md"></span>
            <span className="skeleton-box w-24 h-2 rounded-md"></span>
            </div>
                    
            </div>
            <div className="p-8 pl-20 flex">  
            <span className="skeleton-box w-72 h-8 rounded-md "></span>
                 
            </div>
     
  
             

    </div>


    </div>
  )
}

export default PostSkeleton