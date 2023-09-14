import Image from 'next/image'
import React from 'react'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'

const LikeComment = ({ postid, userLikes, like, unlike, commentRef, posterId, optimistic = false }:
     { postid: string, userLikes: boolean, posterId: string, optimistic: boolean,
       like: any, unlike: any 
      commentRef: React.RefObject<HTMLDivElement>}) => {

    const profile = useCurrentUserProfile()

    const moveToComment = () => {

        commentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

  return (
    <div>
        <hr className="border-gray-600"/>
            <div className="flex  justify-center text-xl items-center 2 transition-opacity  ">
                <button className={`${optimistic ? 'opacity-30' : 'opacity-100'} flex items-center gap-2 p-4 transition-opacity justify-center cursor-pointer
                                     hover:backdrop-brightness-200 basis-1/2 `}
                                     disabled={optimistic}
                        onClick={userLikes ? () => unlike.mutate({postid:postid}) : 
                    () => like.mutate({postid:postid, userid:posterId, currentUser:profile?.username})}
                                     >
                                        {userLikes ?
                <div className="flex items-center gap-2"> 
                    <Image width={30} height={30}  src='/icons/tick.svg'  alt="icon"  />
                     <h2>Liked</h2>
                </div> 
                : 
                <div className="flex items-center gap-2">
                    
                     <Image width={30} height={30}  src='/icons/thumbs-up.svg'  alt="icon"  />
                      <h2>Like</h2>
                </div>                                  }
                </button>
                <div className={`flex items-center gap-2 p-4  justify-center cursor-pointer
                                     hover:backdrop-brightness-200 basis-1/2 `}
                                     onClick={() => moveToComment()}>
                    <Image width={30} height={30}  src='/icons/comment.svg'  alt="icon"  />
                <h2>Comment</h2>
               </div>
            </div>
        <hr className="border-gray-600"/>
    </div>
  )
}

export default LikeComment