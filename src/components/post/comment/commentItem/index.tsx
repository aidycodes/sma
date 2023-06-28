import Image from 'next/image'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useLikeComment from '~/hooks/api/useLikeComment'
import { useRouter } from 'next/router'
import useUnlikeComment from '~/hooks/api/useUnlikeComment'
import CommentUserToolTip from '~/components/userToolTip/commentUserTip'
import Link from 'next/link'
dayjs.extend(relativeTime)

type Comment = {
    content: string,
    profile: Profile
    created_at: Date
    postid: string
    likes_cnt: number
    likes: any
    commentid: string
    type?: string
    commentRef?: string
}

type Profile = {
    avatar: string
    userid: string
    username: string
}


const CommentItem = ({ 
  content, created_at, commentid, 
  postid, likes, type, commentRef,
  profile}: Comment ) => {

    const { avatar, userid, username } = profile
    const [showUserToolTip, setShowUserToolTip] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)
 
    const likeComment = useLikeComment(postid, commentid, type)
    const unlikeComment = useUnlikeComment(postid, commentid, type )

    React.useEffect(() => {
        if(commentRef === commentid) {
            ref.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])

  return (
    <div ref={ref} className="  rounded-md  mr-4 ">    
      <div className="flex gap-2">
       <div className="flex flex-col items-center gap-2 w pl-8 mt-2">
            <div className="w-12 h-12 rounded-[50px] relative mr-auto  ">
                        <Image className="rounded-[50px] absolute" fill 
                            src={avatar ?  avatar : '/icons/user.svg'} 
                            alt="avatar"  />
            </div>    
            </div>  
    <div className=" py-2 rounded-md  fg ">  
      <div className=" items-stretch flex-col flex" >
        <div className=" pl-4 p-2 rounded-xl  backdrop-brightness-200" >
          <div>
            <div className="flex items-center gap-2" > 
              <div  onMouseOver={() => setShowUserToolTip(true)}  onMouseLeave={() => setShowUserToolTip(false)}>
                <Link href={`/user/${userid}`}>
                <h2 className="text-md font-semibold cursor-pointer hover:underline" 
                >{username}</h2>
                 </Link>
            {showUserToolTip && <CommentUserToolTip userid={userid} avatar={avatar} username={username}/>}
            </div>  
            <span>·</span>
            <h4 className="text-xs " >{dayjs(created_at).fromNow()}</h4>
          </div>
        </div>
        <div className="text-lg pl-2">
           {content}
        </div>
      </div>
        <div className="flex justify-between relative">
          <div className="pl-6 cursor-pointer ">
          { commentid.startsWith('opitmistic') ? <span className="opacity-20">Like</span> : 
          likes.some((like: any) => like.user.id === userid) ? <span  className="hover:font-bold" 
                                                                  onClick={() => unlikeComment.mutate({commentid})}
                                                                  >Unlike</span> 
                                                              : <span  className="hover:font-bold"
                                                                  onClick={() => 
                                                                    likeComment.mutate({commentid, postid, userid, currentUser:username})}
                                                                >Like</span>  }
          </div>
        {likes.length > 0  &&
        <div className="fg border-2 border-blue-700 p-1 rounded-xl absolute bottom-0 right-[-15px]">        
          {likes.length} Likes   
        </div>
}
          </div>
       </div>
      </div>
     
     </div>
    </div>

  )
}

export default CommentItem