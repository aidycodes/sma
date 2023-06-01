import Image from 'next/image'
import React, { BaseSyntheticEvent } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import usePostComment from '~/hooks/api/profileFeed/usePostComment-profile'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import { api } from '~/utils/api'

type Inputs = {
    comment: string
}

const PostComment = ({ postid, profileId } : { postid: string, profileId: string}) => {

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            comment: ''
        }
    })
    const trpc = api.useContext()
    const profile = useCurrentUserProfile()
   const newComment = usePostComment(postid, profileId)
              
    
    const user = useCurrentUserProfile()
    const onSubmit: SubmitHandler<Inputs> = (data, e: BaseSyntheticEvent<object, any, any> | undefined) => {
       if(!e) return
        e.preventDefault()
  
        newComment.mutate({title:'', postid:postid, content:data.comment})
        setValue('comment', '')        
    }

  return (
        <form className='flex gap-2 p-2 m-4 items-center  pb-4'
        onSubmit={handleSubmit(onSubmit)}>
            <div className="w-10 h-10 rounded-[50px] relative">
                    <Image className="rounded-[50px]" fill 
                            src={user.avatar ?  user.avatar : '/icons/user.svg'} 
                            alt="avatar"  />
            </div>
                <input className="rounded-[50px] h-12 w-full pl-4  placeholder:text-slate-300" 
                placeholder='write a comment...'
                {...register("comment", { required: true })}
                />
        </form>
  )
}

export default PostComment