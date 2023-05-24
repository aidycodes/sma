import React, { useState } from 'react'
import About from './about'
import Banner from './banner'
import ProfileAvatar from './profileAvatar'
import ProfileButton from './profileButton'
import { Open_Sans } from 'next/font/google';
import millify from "millify";
import { api } from '~/utils/api'
import { getQueryKey } from '@trpc/react-query'
import { Updater, useQueryClient } from '@tanstack/react-query'

type Props = {
    userid: string
    cover?: string | null 
    avatar?: string | null
    username?: string | null
    education?: string | null
    bio?: string | null
    work?: string | null
    followsUser?: boolean
    userFollows?: boolean
}

export type FollowInfo = {
    followsUser: boolean
    userFollows: boolean
}

const openSans = Open_Sans({
  weight: '400',
  subsets: ['latin'],
});

const Profile = ({ userid, cover, avatar, username,  followsUser,
    userFollows, ...about }: Props) => {

    const [ followLoading, setFollowLoading ] = useState(false)

    const queryClient = useQueryClient()

    const followInfoQueryKey = getQueryKey(api.follow.isFollowerFollowing, {id:userid}, 'query')
    const followUser = api.follow.followUser.useMutation({
        onMutate: async () => {
            console.log('hiddddddd')
            queryClient.setQueryData(followInfoQueryKey, (oldData) => {
                const data = oldData as FollowInfo
                return {
                    ...data,
                    followsUser: true
                }

            })
    },
    onError: async (error, variables, context) => {
        queryClient.setQueryData(followInfoQueryKey, (oldData) => {
            const data = oldData as FollowInfo
            return {
                ...data,
                followsUser: false
            }

        })
    },
    onSettled: async (data, error, variables, context) => {
        queryClient.invalidateQueries(followInfoQueryKey)    
    }
})

 const unFollowUser = api.follow.unfollowUser.useMutation({
        onMutate: async () => {
          
            queryClient.setQueryData(followInfoQueryKey, (oldData) => {
                const data = oldData as FollowInfo
                return {
                    ...data,
                    followsUser: false
                }
            })
    },
    onError: async (error, variables, context) => {
        queryClient.setQueryData(followInfoQueryKey, (oldData) => {
            console.log('ERRRRORRRR')
            const data = oldData as FollowInfo
            return {
                ...data,
                followsUser: true
            }
        })
    },
    onSettled: async (data, error, variables, context) => {
        queryClient.invalidateQueries(followInfoQueryKey)    
    }
})


    
 
  return (
    <div>
        <div className="relative flex justify-center w-full  ">
        <div className="w-full ">
        <ProfileAvatar avatar={avatar}/>
     
        </div>
        
        </div>
        
       <div className="mt-32 flex flex-col items-center ">
        <h2 className={`text-5xl text-primary ${openSans}`}>
        {username && username?.charAt(0).toUpperCase() + username?.slice(1)}
        </h2>
        <div>
        <h4>{millify(2934322)} followers</h4>
        </div>
        <div className="flex  justify-around w-full mt-4">
            <ProfileButton label={ followsUser ? "Following" : "Follow"} 
                onClick={ !followsUser ? () => { followUser.mutate({id:userid, currentUser:username ? username : ''})} :
                 () => {unFollowUser.mutate({id:userid}) }}
            />
            <ProfileButton label="Message"/>
        </div>
        <div className="flex w-full flex-col justify-center items-center xl:items-start  xl:flex-row ">
        <div className=" xl:w-1/2">
        <About {...about}/>
        </div>
        <div className="w-full h-[800px] bg-slate-300 m-8 xl:m-4"> POST PLACEHOLDER</div>
        </div>
    </div>
    </div>
  )
}

export default Profile