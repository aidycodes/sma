import { UserProfile } from '@prisma/client'
import React from 'react'
import { useOutsideClick } from '~/hooks/useOutsideClick'
import { SearchUsers } from '..'
import SearchItem from './SearchItem'



const SearchBox = ({ users, isFetching, isLoading, isRefetching, search, isFetched, refe }:
     { users: SearchUsers, isFetching: boolean, refe: React.MutableRefObject<HTMLDivElement>,
        isFetched: boolean, 
        isLoading: boolean, 
         isRefetching: boolean, 
         search: string  }) => {


    const usersList = users?.map((user: UserProfile | null) => ( 
        <SearchItem avatar={user?.avatar as string} username={user?.username} userid={user?.userid}/>
        ))

        const [isTyping, setIsTyping] = React.useState(false)
       

        React.useEffect(() => {
            setIsTyping(true)
        }, [search])

        React.useEffect(() => {
            if(isFetched){
            setIsTyping(false)
            }
        }, [isFetched])


    if(isFetching || isLoading || isRefetching) return (
        <div ref={refe} className="absolute top-8 h-40 w-full  bg-white rounded-md bg shadow-xl">
            <div className="h-full flex justify-center items-center">
                <h1 className="text-gray-400 text-xl">Searching...</h1>
            </div>
        </div>
    )
    if(isTyping) return (  
        <div ref={refe} className="absolute top-8 h-40 w-full  bg-white rounded-md bg shadow-xl">
            <div className="h-full flex justify-center items-center">
                <h1 className="text-gray-400 text-xl"></h1>
            </div>
        </div>
        )

    if(users?.length === 0) return (
        <div ref={refe} className="absolute top-8 h-40 w-full  bg-white rounded-md bg shadow-xl">
            <div className="h-full flex justify-center items-center">
                <h1 className="text-gray-400 text-xl">No users found</h1>
            </div>
        </div>
    )

    

  return (
        <div ref={refe} className="absolute top-8 h-40 w-full
          bg-white rounded-md bg shadow-xl overflow-y-scroll scrollbar-hide ">
            {usersList}
        </div>
  )
}

export default SearchBox