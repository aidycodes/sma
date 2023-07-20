import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { use } from 'react'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import useFollowUser from '~/hooks/api/useFollowUser'
import useIsFollowerFollowing from '~/hooks/api/useIsFollowerFollowing'
import useUnfollowUser from '~/hooks/api/useUnfollowUser'
import { api } from '~/utils/api'
import Avatar from '../avatar'
import ProfileButton from '../profile/profileButton'

type Props = {
    avatar?: string | null
    username?: string
    userid?: string

}


const UserToolTip = ({username, userid: id, avatar }: Props) => {

    if(!id) return null
     const currentUser = useCurrentUserProfile()
     if(id === currentUser?.userid) return null
   const { followUser  } = useFollowUser(id) 
   const { unFollowUser } = useUnfollowUser(id)    
    const { data }  = useIsFollowerFollowing(id)
   
    const { mutate, isLoading } = api.chat.createChat.useMutation({
        onSuccess: (data) => {
            router.push(`/chat/${data?.chat?.chatid}`)
        }
    })
    const router = useRouter()

    const handleMessageButton = () => {
        const chatid = mutate({users: [id]})
    }
    
   if(!data) return null
    
    return(
   <div className="w-80 h-40 fg absolute top-10 p-2 shadow-xl z-50 border-slate-600 rounded-md border-[1px] ">
    <Link href={`/user/${id}`}>
        <div className="fg flex items-center gap-2 shadow-xl">
        <div className="h-16 w-16 relative mt-1 rounded-[50px]">
            <Image fill src={avatar ? avatar : '/icons/user.svg'} className="rounded-[50px]" alt="user pic"/>
        </div>
            <div className="flex flex-col">
                <h2 className="font-semibold text-xl">
                {username}
                </h2>
                {data.userFollows && <h4 className="text-xs  ">You are following</h4>}
                </div>
                
        </div>
        <div className="flex justify-center gap-4 pt-4 ">
         {currentUser?.userid !== id && <>
        <ProfileButton label={"message"} icon={'/icons/comment-alt-message.svg'} onClick={handleMessageButton} isLoading={isLoading} />
         <ProfileButton label={data.userFollows ? "following" : "follow"} 
            icon={data.userFollows ? "/icons/tick.svg" : "/icons/tick.svg"} 
            isTrue={data.userFollows}
         onClick={!data.userFollows ? () => { followUser.mutate({id:id, currentUser:currentUser?.username})} :
                                         () => unFollowUser.mutate({id:id})
        } 
         />
        </>}
        </div>
    </Link>
    </div>
    )
}

export default UserToolTip