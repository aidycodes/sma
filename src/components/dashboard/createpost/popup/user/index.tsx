import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from '~/components/menu'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import { whereToPostAtom } from '~/jotai/store'
import PostTypeComponent from './postTypePopup'

const User = () => {

    const profile = useCurrentUserProfile()
    const [whereToPost] = useAtom(whereToPostAtom)

  return (
        <div className="flex">
            <div className="relative w-14 h-14">
                <Link href={`/user/${profile?.userid}`}>
                <Image className="rounded-[100px]" src={profile?.avatar ? profile?.avatar : '/icons/user.svg'} 
                       fill alt="user" />
                </Link>
            </div>
            <div>
                <div>
                    <h2 className="pl-2 font-semibold tracking-wider pt-1">{profile?.username && profile.username}</h2>
               </div>
                <div className="flex items-center justify-center">
                    <Menu component={<PostTypeComponent/>} icon="angle-down.svg" size={24} width={300} text={whereToPost}  forPost={true} />
                </div>
            </div>
        </div>
  )
}

export default User