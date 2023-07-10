import { UserProfile } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { SetSearchTerm, SetSelectedUser } from '..'

const SelectItem = ({ user, setselectedUser, setSearchTerm }:
     { user: UserProfile , setselectedUser: SetSelectedUser
    setSearchTerm: SetSearchTerm }) => {
   

        const handleClick = () => {
            setselectedUser(users => [...users, user])
            setSearchTerm("")
        }

  return (
    <div>
    <div className="flex p-2 items-center justify-center hover:backdrop-brightness-125 cursor-pointer " onClick={() => handleClick()}>
        <div className="w-12 h-12 relative">
            <Image src={user?.avatar ? user?.avatar : '/icons/user.svg'} fill className="rounded-full" alt="avatar" />
        </div>
        <div className="mr-auto text-xl text-secondary ml-auto">
        <h2>{user?.username && (user?.username?.charAt(0)?.toUpperCase() + user?.username?.slice(1)) }</h2>
        </div>
        
    </div>
    <hr className="h-px  bg-gray-700 border-0 opacity-10 "/>
    </div>
  )
}

export default SelectItem