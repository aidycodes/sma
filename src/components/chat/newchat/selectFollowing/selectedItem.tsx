import { UserProfile } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { SetSelectedUser } from '..'

const SelectedItem = ({ user, setSelectedUser }:
     { user: UserProfile, setSelectedUser: SetSelectedUser  }) => {
  return (
        <div className=" h-20   lg:w-80 p-2 flex items-center gap-8 self-center cursor-pointer border-b-[1px] border-primary last:border-none ">  
           <div className="">
              <Image src={user?.avatar ? user?.avatar : '/icons/user.svg'} width={40} height={40} className="rounded-full overflow-hidden w-[48px] h-[48px]" alt="avatar" />
            </div>
            <h2 className="text-xl">{user?.username}</h2>
            <div className=" ml-auto" onClick={() => setSelectedUser((
                users: UserProfile[]) => users.filter(u => u.userid !== user.userid))}>
                <Image  src='/icons/redcross.svg' width={40} height={40}  alt="close" />
            </div>
        </div>
  )
}

export default SelectedItem