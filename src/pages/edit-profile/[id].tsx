import React from 'react'
import { useForm } from "react-hook-form";
import Layout from '~/components/Layout';

type FormData = {
    username: string;
    work: string;
    education: string;
    bio: string;
};

const EditProfile = () => {

      const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = handleSubmit(data => console.log(data))
  return (
    <Layout>
        <div className="fg p-8 rounded-md shadow-md">
        <h1 className="text-center pb-4 font-semibold tracking-widest">Edit Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <h2 className="font-semibold tracking-widest">Username</h2>
            <input className="rounded-md p-1" {...register("username")} />
                 <h2 className="font-semibold tracking-widest">Work</h2>
            <input className="rounded-md p-1" {...register("work")} />
                <h2 className="font-semibold tracking-widest">Education</h2>
            <input className="rounded-md p-1" {...register("education")} />
               <h2 className="font-semibold tracking-widest">Bio</h2> 
            <textarea className="rounded-md p-1 h-40 w-80" {...register("bio")} />            

            <input className="outline rounded-md hover:highlight cursor-pointer" type="submit" />
        </form>
        </div>
    </Layout>
  )
}

export default EditProfile