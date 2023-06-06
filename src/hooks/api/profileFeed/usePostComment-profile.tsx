import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'
import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom } from "~/jotai/store";

const usePostComment = (postid: string) => {

    const trpc = api.useContext()
    const profile = useCurrentUserProfile()
    const params = useRouter()
    const [page, profileId] = params.asPath.substr(1).split('/')
    const [ [type, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)

    const postType = type === 'geo' ? 'geoComment' : 'comment' 

     return api[postType].new.useMutation({
        onMutate: async (postData) => {
            if(page === 'user' && profileId){
            trpc.userQuery.getUserPosts.cancel()
            trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, (data: any) => {
                return handleOptimisticPostUpdate(data, postid, profile, postData)
 
                    }) 
                }
            if(page === 'dashboard' && type !== 'geo'){
                trpc.feed.getFollowerFeed.cancel()
                trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (data: any) => {
                 if(data){
                    return handleOptimisticPostUpdate(data, postid, profile, postData)
                }
                })
            }
            if(page === 'dashboard' && type === 'geo' && currentLocation){
                trpc.feed.getGeoFeed_current.cancel()
                trpc.feed.getGeoFeed_current.setInfiniteData({lat:currentLocation.lat, lng:currentLocation.lng}, (data: any) => {
                    if(data){
                        return handleOptimisticPostUpdate(data, postid, profile, postData)
                    }
                    })
                }
            },
            onError: () => {
                toast.error('error creating comment')
                trpc.userQuery.getUserPosts.invalidate({id:profileId, postAmt:3})
                trpc.feed.getFollowerFeed.invalidate({postAmt:5})
                trpc.feed.getGeoFeed_current.invalidate()
            },
            onSuccess: () => {
             trpc.userQuery.getUserPosts.invalidate({id:profileId, postAmt:3})
             trpc.feed.getFollowerFeed.invalidate({postAmt:5})
             trpc.feed.getGeoFeed_current.invalidate()
            }
})
 
}

export default usePostComment

function handleOptimisticPostUpdate(data: any, postid: string, profile: any, postData: any) {
             const updatedData = data?.pages.map((page: any) => {
                    const pages = page?.posts.map((post: any) => {
                        if(post.postid === postid) {
                            return {...post, comment_cnt:post.comment_cnt+1, comments:[...post.comments, {...postData, commentid:'opitmistic',
                             likes_cnt:0, likes:[], 
                             created_at:new Date(),
                             updated_at: new Date(),
                             user:{profile:{avatar:profile.avatar, username:profile.username, userid:profile.userid}},
                             userid:profile.userid
                            }]}
                        }
                         return post
                        })
                        return {...page, posts:pages}
                        })
              
              return {...data, pages:updatedData}
}