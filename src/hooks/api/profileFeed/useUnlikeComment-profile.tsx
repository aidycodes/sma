import React from 'react'
import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'
import { QueryParams } from './useLikeComment-profile'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom } from "~/jotai/store";

const useUnlikeComment = (postid: string, commentid: string) => {
    const trpc = api.useContext()

    const { userid } = useCurrentUserProfile()
    const router = useRouter()
    const [page, profileId] = router.asPath.substr(1).split('/')
    const [ [type, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)

    const postType = type === 'geo' ? 'geoComment' : 'comment' 

        return api[postType].unlike.useMutation({
    onMutate: async (like) => {
        if(page === 'user' && profileId){    
        trpc.userQuery.getUserPosts.cancel()
        trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, (data: any) => {
            return optimisticUnlikeComment(commentid, data, postid, userid)
                })          
        }
        if(page === 'dashboard' && type !== 'geo'){
        trpc.feed.getFollowerFeed.cancel()
                trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (data: any) => {
                    return optimisticUnlikeComment(commentid, data, postid, userid)
                }) 
            }
       if(page === 'dashboard' && type === 'geo' && currentLocation){
                trpc.feed.getGeoFeed_current.cancel()
                console.log('mooooo')
                trpc.feed.getGeoFeed_current.setInfiniteData({lat:currentLocation.lat, lng:currentLocation.lng}, (data: any) => {
                    return optimisticUnlikeComment(commentid, data, postid, userid)
                })
            }
    },
    onError: (error: any) => {
        console.log({error})
        toast.error('error unliking comment')
    },
    onSettled: () => {
        trpc.userQuery.getUserPosts.invalidate({})
       trpc.feed.getFollowerFeed.invalidate({})
       trpc.feed.getGeoFeed_current.invalidate({})
    }
    })
}

export default useUnlikeComment

function optimisticUnlikeComment(commentid: string, data: any, postid: string, userid: string) {
     const updatedData = data?.pages.map((page: any) => {
          const posts = page?.posts.map((post: any) => {
            if(post.postid === postid) {
              return {...post, comments:post.comments.map((comment: any) => {
                if(comment.commentid === commentid) {
                  return {...comment, likes_cnt:comment.likes_cnt-1, likes:[...comment.likes.filter((like: any) => like.user.id !== userid)]}
                }
                return comment
              })}
            }
            return post
          })
          return {...page, posts}
        })
        return {...data, pages:updatedData}
}

