import Image from 'next/image'
import React from 'react'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import useLikePost from '~/hooks/api/profileFeed/useLikePost'
import { api } from '~/utils/api'
import useUnlikePost from '~/hooks/api/profileFeed/useUnlikePost-profile'
import { Unlike } from '~/components/profile/postfeed'

const LikeComment = ({ postid, userLikes, like, unlike }:
     { postid: string, userLikes: boolean
       like: any, unlike: any }) => {

   // const like = useLikePost('WRdW83qzlVMK2qe')
 //   const unlike = useUnlikePost('WRdW83qzlVMK2qe', postid)
    const profile = useCurrentUserProfile()


  return (
    <div>
        <hr className="border-gray-600"/>
            <div className="flex  justify-center text-xl items-center 2  ">
                <div className=" flex items-center gap-2 p-4  justify-center cursor-pointer
                                     hover:backdrop-brightness-200 basis-1/2 "
                        onClick={userLikes ? () => unlike.mutate({postid:postid}) : 
                    () => like.mutate({postid:postid, userid:profile.userid, currentUser:profile.username})}
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
                </div>
                <div className={`flex items-center gap-2 p-4  justify-center cursor-pointer
                                     hover:backdrop-brightness-200 basis-1/2 `}>
                    <Image width={30} height={30}  src='/icons/comment.svg'  alt="icon"  />
                <h2>Comment</h2>
               </div>
            </div>
        <hr className="border-gray-600"/>
    </div>
  )
}

export default LikeComment