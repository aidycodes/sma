import { Comment, Like, Post, UserProfile } from '@prisma/client'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Icon from '../icon'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import PostHeader from './header'
import PostSettings from './settings'
import Menu from '../menu'
import PostCounter from './counter'
import LikeComment from './likeComment'

dayjs.extend(relativeTime)

interface ExtendedUser {
    followers_cnt: number
    profile: UserProfile | null
}


interface Props extends Post {
    user: ExtendedUser
    comments: Comment[]
    likes: Like[]
    like: () => void
    unlike: () => void

    }

const PostItem = ( {postid, created_at, title, 
    content, meta, user, 
    likes_cnt, comment_cnt, likes, like, unlike }: Props ) => {

        const { theme } = useTheme()

    if(!user) return null
  return (
    <div className="fg m-8 rounded-xl dbo-border">
                                         {/*heading component*/}
        <div className="fg rounded-xl">
            <div className="flex p-4">
                <PostHeader avatar={user?.profile?.avatar} userid={user?.profile?.userid} 
                    username={user?.profile?.username} created_at={created_at} />
              
                <div className="ml-auto flex items-start gap-2 ">
                <Menu icon='/setting.svg' size={30} component={<PostSettings/>} width={48}></Menu>
                  <Icon size={30} isSelected={false} name='/cross.svg' onClick={() => {}}  />
                </div>
            </div>
            <div className="p-8">
                {content}
            </div>
                                                 {/* counter component */}
             <PostCounter likes_cnt={likes_cnt} comment_cnt={comment_cnt} />
           {/* like message component */}
            <LikeComment userLikes={likes.some((like: any) => like?.user.profile?.userid === user?.profile?.userid)} 
                         postid={postid} like={like} unlike={unlike} />
                
          
                                                 {/* comment input component */}
            <div className='flex gap-2 p-2 items-center  pb-4'>
                <div className="w-10 h-10 rounded-[50px] relative">
                        <Image className="rounded-[50px]" fill 
                            src={user?.profile?.avatar ?  user.profile?.avatar : '/icons/user.svg'} 
                            alt="avatar"  />
                </div>
                <input className="rounded-[50px] h-8 w-full placeholder:p-4 placeholder:text-slate-300" placeholder='write a comment...'/>
            </div>
    </div>


    </div>
  )
}

export default PostItem