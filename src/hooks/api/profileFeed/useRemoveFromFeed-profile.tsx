import React from 'react'
import { api } from '~/utils/api'

export const useRemoveFromFeed = (profileId: string, postId: string) => {
  
    const trpc = api.useContext()
   const remove = () => { 
   trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, 
    (oldData) => {
        if(oldData){
                const pages =  oldData.pages.map((page: any) => {
                    return {
                    ...page,
                    posts: page.posts.filter((post: any) => post.postid !== postId),
                    }
                  
        })
        return {...oldData, pages}
        }
    })
} 
return remove
}
