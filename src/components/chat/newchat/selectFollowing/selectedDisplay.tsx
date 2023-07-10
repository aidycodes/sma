import { UserProfile } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { SetSelectedUser } from '..'
import SelectedItem from './selectedItem'

const SelectedDisplay = ({selectedUser, setSelectedUser}:
     {selectedUser: UserProfile[], setSelectedUser: SetSelectedUser }) => {

    if(selectedUser.length <=  0) {
        return (
        <div className="border-primary h-20  border-2 lg:w-80 p-2 flex items-center gap-8 mt-16  self-center ">  
            <Image src='/icons/user.svg' width={40} height={40} className="rounded-full" alt="avatar" />
            <h2>No User Selected</h2>
            <div className=" ml-auto">
                <Image  src='/icons/redcross.svg' width={40} height={40}  alt="close" className="" />
            </div>
        </div>
            )
        }
      
  return (
          <div className=" border-primary mt-16  hover:border-teal-600 border-2">
            {selectedUser?.map(user => <SelectedItem user={user} setSelectedUser={setSelectedUser} />)}
        </div>
  )
}
     
export default SelectedDisplay