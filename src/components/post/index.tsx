import type { Comment, Like, Post, UserProfile } from '@prisma/client'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Icon from '../icon'
import PostHeader from './header'
import PostSettings from './settings'
import Menu from '../menu'
import PostCounter from './counter'
import LikeComment from './likeComment'
import CommentItem from './comment/commentItem'
import PostComment from './comment/postComment'
import Content from './content'
import useLikePost from '~/hooks/api/useLikePost'
import useUnlikePost from '~/hooks/api/useUnlikePost'
import { Josefin_Sans  } from 'next/font/google';
const jose = Josefin_Sans({ subsets: ['latin'], weight:'400' });

dayjs.extend(relativeTime)

interface ExtendedUser {
    followers_cnt: number
    profile: UserProfile 
}

interface ExtendedPost extends Post {
    type?: string
}

interface Props extends ExtendedPost {
    user: ExtendedUser
    comments: Comment[]
    likes: Like[]
    showAllComments?: boolean
    setFilterFeed?: React.Dispatch<React.SetStateAction<string[]>>
    commentRef?: string
    
    }

    export type SetCommentCount = React.Dispatch<React.SetStateAction<number>>

const PostItem = ( {postid, created_at, title, 
    content, meta, user, comments, showAllComments, commentRef,
    likes_cnt, comment_cnt, likes, setFilterFeed, type }: Props ) => {
        const [commentCount, setCommentCount] = React.useState(!showAllComments ? 5 : comments.length+1)
        const ref = React.useRef<HTMLDivElement>(null)
        const like = useLikePost(type)
        const unlike = useUnlikePost(type)
    
    const handleCommentCount = () => {
        setCommentCount(comments.length+1)
    }

    if(!user) return null
  return (
    <div className="fg xs:m-2 md:m-8 rounded-xl dbo-border">
    {/*heading component*/}
        <div className="fg rounded-xl">
            <div className="flex p-4 ">
                <PostHeader avatar={user?.profile?.avatar} userid={user?.profile?.userid} 
                    username={user?.profile?.username} created_at={created_at}  />  
                { title && <div className={`self-auto mt-[8px] ml-2 text-gray-400 text-lg  ${jose.className}`}>{title}</div>   }     
                <div className="ml-auto flex items-start gap-2 "> 
                <Menu icon='/setting.svg' size={30} component={<PostSettings/>} width={48}></Menu>
                 {setFilterFeed && <Icon size={30} isSelected={false} name='/cross.svg' onClick={() => setFilterFeed((prevData) => [...prevData, postid])}  /> }
                </div>
            </div>
            <div className="p-8">
                <Content content={content} meta={meta}/>
            </div>
        {/* counter component */}
             <PostCounter likes_cnt={likes_cnt} comment_cnt={comment_cnt}
                userLikes={likes.some((like: any) => like?.user?.profile?.userid === user?.profile?.userid)} />
           {/* like message component */}
            <LikeComment userLikes={likes.some((like: any) => like?.user?.profile?.userid === user?.profile?.userid)} 
                         postid={postid} like={like} unlike={unlike} commentRef={ref} />
                
        {/* comment list component */}            
            <div className="flex flex-col gap-2 ">
           { comments.map(({ content, commentid, user, created_at, postid, likes, likes_cnt }: any, i) => {
                if(i < commentCount){
                   
                   return (
                   <div  key={commentid}>
                   <CommentItem content={content} 
                    profile={user?.profile} created_at={created_at}
                    postid={postid} likes={likes} likes_cnt={likes_cnt} 
                    commentid={commentid} type={type} commentRef={commentRef}
                    />
                    </div>
                   )
                  }
                if(i === commentCount && comments.length > commentCount){
                        return <div key={commentid} className="text-center text-blue-500 hover:text-blue-400 cursor-pointer"
                            onClick={() => setCommentCount(comments.length)}
                            >View more comments</div>
                  }
           })
           }
            </div>
        {/* comment input component */}
            <div ref={ref}>
                 <PostComment postid={postid} profileId={user.profile.userid} type={type} setCommentCount={handleCommentCount} />
            </div>
        </div>


    </div>
  )
}

export default PostItem