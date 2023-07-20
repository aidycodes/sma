import React from 'react'
import About from './about'
import ProfileAvatar from './profileAvatar'
import ProfileButton from './profileButton'
import { Open_Sans } from 'next/font/google';
import millify from "millify";
import { api } from '~/utils/api'
import useFollowUser from '~/hooks/api/useFollowUser'
import useUnfollowUser from '~/hooks/api/useUnfollowUser'
import ProfileFeed from './postfeed';
import { useRouter } from 'next/router';
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile';


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
    followers_cnt?: number | null
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
    userFollows, followers_cnt,  ...about }: Props) => {

        const { followUser } = useFollowUser(userid)
        const { unFollowUser } = useUnfollowUser(userid)
        const router = useRouter()

  const { data } =   api.userQuery.getUserPosts.useInfiniteQuery({id:'WRdW83qzlVMK2qe', postAmt:3 }, {
    getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined
  })

  const { mutate, isLoading } = api.chat.createChat.useMutation({
    onSuccess: (data) => {
      router.push(`/chat/${data?.chat?.chatid}`)
    }
  })
  const currentUser = useCurrentUserProfile()

        
  return (
<div>
    <div className=" ">
        <div className="lg:flex  lg:items-center lg:flex-shrink lg:max-w-full ">
        <div className="relative flex justify-center w-full lg:justify-start  ">   
            <ProfileAvatar avatar={avatar}/>
        </div> 
        </div>
         <div className="">
    <div className="mt-32 flex flex-col items-center xl:flex-col lg:mt-0  2xl:items-start lg:ml-80 ">
       <div className="flex flex-col  items-center lg:flex-row lg:w-full 2xl:pl-24 ">
        <div className="flex flex-col  items-center lg:items-start">
        <h2 className={`text-5xl text-primary ${openSans} `}>
        {username && username?.charAt(0).toUpperCase() + username?.slice(1)}
        </h2>
        <div>
            {followers_cnt &&
        <h4>{millify(followers_cnt)} followers</h4>
            }
        </div>
        </div>
        <div className="flex  justify-end w-full mt-4 gap-8 sm:gap-32 lg:gap-2 xl:gap-6 xl:justify-center xl:items-center lg:mr-8 xl:mr-24 ">
         { currentUser?.userid !== router?.query?.id && <> <ProfileButton label={ userFollows ? "Following" : "Follow"} 
                onClick={ !userFollows ? () => { followUser.mutate({id:userid, currentUser:username ? username : ''})} :
                 () => {unFollowUser.mutate({id:userid}) }}
            />
            <ProfileButton isLoading={isLoading} label="Message" onClick={() => {
                mutate({users:[userid]})
            }}/>
        </>
        }
        </div>
    </div>
        </div>
    </div>
        <div className="flex w-full flex-col justify-center items-center lg:items-start lg:gap-2 xl:gap-4 lg:flex-row ">
        <div className=" lg:w-1/2">
        <About {...about}/>
        </div>
        <div className="  border-2rounded-md  w-11/12">
            <div className="w-[100px] ml-8 px-2 fg py-2 rounded-md text-2xl text-center">Posts</div>
                <ProfileFeed/>
        </div>
        </div>
    </div>
</div>
  )
}

export default Profile