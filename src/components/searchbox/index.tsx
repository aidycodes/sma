import { UserProfile } from '@prisma/client'
import React from 'react'
import { useOutsideClick } from '~/hooks/useOutsideClick'
import { SetSearchTerm, SetSelectedUser } from '../chat/newchat'
import SelectMap from '../chat/newchat/selectFollowing/SelectMap'

const SearchBox = ({ selectedUser, searchTerm, setselectedUser, setSearchTerm }:
     {selectedUser: UserProfile[], searchTerm: string, setselectedUser: SetSelectedUser, setSearchTerm: SetSearchTerm}) => {
        const ref = React.useRef<HTMLDivElement>(null)
        useOutsideClick(ref, () => setSearchTerm(""))
  return (
    <div ref={ref} className={`max-h-40 absolute fg w-full overflow-y-scroll`}>
        <SelectMap selectedUser={selectedUser} searchTerm={searchTerm} setselectedUser={setselectedUser} setSearchTerm={setSearchTerm}/>
    </div>
  )
}

export default SearchBox