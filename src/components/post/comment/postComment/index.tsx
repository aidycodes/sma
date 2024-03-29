import Image from 'next/image'
import React, { BaseSyntheticEvent } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import usePostComment from '~/hooks/api/usePostComment'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import { SetCommentCount } from '../..'

type Inputs = {
    comment: string
}

const PostComment = ({ postid, profileId, type, setCommentCount } :
     { postid: string, profileId: string, type?: string,
         setCommentCount: () => void }) => {

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            comment: ''
        }
    })
   const newComment = usePostComment(postid, type)
              
   const currentUser = useCurrentUserProfile() 
    const user = useCurrentUserProfile()
    const onSubmit: SubmitHandler<Inputs> = (data, e: BaseSyntheticEvent<object, any, any> | undefined) => {
       if(!e) return
        e.preventDefault()
        newComment.mutate({title:'', postid:postid, content:data.comment, currentUser:currentUser?.username})
        setValue('comment', '')
        setCommentCount()        
    }

  return (
        <form className='flex gap-2 p-2 m-4 items-center  pb-4'
        onSubmit={handleSubmit(onSubmit)}>
            <div className="w-10 h-10 rounded-[50px] relative">
                    <Image className="rounded-[50px]" fill 
                            src={user?.avatar ?  user?.avatar : '/icons/user.svg'} 
                            alt="avatar"  />
            </div>
                <input className={`rounded-[50px] h-12 w-full pl-4  placeholder:text-slate-300 
                ${postid === 'optimistic' ? 'opacity-20' : 'opacity-100'}`} 
                placeholder='write a comment...' disabled={postid === 'optimistic'}
                {...register("comment", { required: true })}
                />
        </form>
  )
}

export default PostComment