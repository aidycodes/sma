import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SearchItem = ({ username, avatar, userid }:
   {username?: string, avatar?: string, userid: string}) => {
  return (
    <Link href={`/user/${userid}`}>
    <div className=" flex w-full hover:backdrop-brightness-125 py-4 px-2 cursor-pointer">
        <div className="h-12 w-16 relative  ">
        <Image src={avatar ? avatar : '/icons/user.svg'} alt="user avatar" fill className="rounded-full"/>
        </div>
        <div className="w-full self-center text-2xl ml-8 ">{username?.charAt(0).toUpperCase()}{username?.slice(1)}</div>
        {/* <button className="rounded-md p-2 bg-blue-700 text-white flex justify-center items-center">
           message
        </button> */}
    </div>
    </Link>
  )
}

export default SearchItem