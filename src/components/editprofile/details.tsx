import { UserProfile } from '@prisma/client';
import { useTheme } from 'next-themes';
import React from 'react'
import { useForm } from "react-hook-form";
import { api } from '~/utils/api';


type FormData = {
    username: string;
    work: string;
    education: string;
    bio: string;
};

const Details = ( user: UserProfile  ) => {
    
    const { register, handleSubmit, setError, 
        formState: { errors, isValid} } = useForm<FormData>();
    
    const { theme } = useTheme()
    const editProfile = api.user.updateProfile.useMutation() 

    register("username", { required: 'Username Required',
        value: user?.username,
        onBlur: () => {
            if(!isValid) {        
                setError('username', {message: 'Username Required'})
            }},
        onChange: () => setError('username', {})  
    })
    register("bio", {
        value: user?.bio || '',
    })
    register("work", {
        value: user?.work || '',
    })
    register("education", {
        value: user?.education || '',
    })

  const onSubmit = handleSubmit(data => editProfile.mutate(data))


  return (
     <div className="fg p-8 rounded-md shadow-md mt-12">
        <h1 className="text-center pb-4 font-semibold tracking-widest">Edit Profile</h1>
        
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="relative max-w-full flex flex-col h-20">
                <h2 className=" font-semibold tracking-widest pb-2">Username</h2>                 
                    <input className={`rounded-md p-1 w-full outline-none 
                    ${errors.username?.message && 'outline-red-400 outline-dashed'}`}
                                                                {...register("username")} />
        {errors.username && 
                <span className=" top-20 text-red-400">{errors.username.message}</span>}
        </div>

        <div className="relative max-w-full flex flex-col h-20">
            <h2 className="font-semibold tracking-widest pb-2">Work</h2>    
                <input className="rounded-md p-1 outline-none" {...register("work")} />
        </div>

        <div className="relative max-w-full flex flex-col h-20">
            <h2 className="font-semibold tracking-widest">Education</h2>
                <input className="rounded-md p-1 outline-none" {...register("education")} />
        </div>

        <div className="relative max-w-full flex flex-col h-20">
            <h2 className="font-semibold tracking-widest ">Bio</h2> 
                <textarea className="rounded-md p-1 h-40 w-80 outline-none" {...register("bio")} />            
        </div>

        <button   className={`outline rounded-md p-1 cursor-pointer ${theme}-menu `} type="submit" >
            Submit
        </button>
        </form> 
    </div>
  )
}

export default Details


