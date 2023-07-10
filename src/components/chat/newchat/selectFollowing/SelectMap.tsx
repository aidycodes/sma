import { UserProfile } from '@prisma/client'
import React from 'react'
import LoadingSpinner from '~/components/loadingspinner'
import { useDebounce } from '~/hooks/useDebounce'
import { api } from '~/utils/api'
import { SetSearchTerm, SetSelectedUser } from '..'
import SelectItem from './SelectItem'

const SelectMap = ({ selectedUser, searchTerm, setselectedUser, setSearchTerm }: 
    {selectedUser: UserProfile[], searchTerm: string, setselectedUser: SetSelectedUser, setSearchTerm: SetSearchTerm}) => {

    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const { data, isLoading, isError } = api.userQuery.searchUsersFollowers.useQuery({searchTerm:debouncedSearchTerm})

    console.log({data})

    if(isLoading) return (<div className="p-4 flex items-center gap-4 text-xl font-thin"><LoadingSpinner size="small"/> <span>Loading...</span></div>)

    if(data?.users?.follows.length === 0) return (<div className="p-4 text-xl font-thin">Not following users with that username.</div>)

    if(isError) return (<div>An Error has occurred</div>)

    const mappedUsers = data?.users?.follows.filter((user) => (selectedUsers => !selectedUsers.includes(user?.profile?.userid)) 
    (selectedUser.map((user) => user?.userid)))
          .map((user) => <SelectItem key={user?.profile?.userid} user={user.profile} 
    setselectedUser={setselectedUser} setSearchTerm={setSearchTerm}/>)

 if(mappedUsers && mappedUsers?.length < 1) return (<div className="p-4 text-xl font-thin">Not Following Any More Users With That Username</div>)

  return (
    <div>{mappedUsers}</div>
  )
}

export default SelectMap