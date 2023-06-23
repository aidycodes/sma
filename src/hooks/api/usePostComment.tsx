import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'
import useCurrentUserProfile from './useCurrentUserProfile'
import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom, radiusAtom } from "~/jotai/store";

const usePostComment = (postid: string, type: string = 'normal') => {

    const trpc = api.useContext()
    const profile = useCurrentUserProfile()
    const params = useRouter()
    const [page, profileId] = params.asPath.substr(1).split('/')
    const [ [, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)
    const [ radius ] = useAtom(radiusAtom)

    const postType = type === 'geo' ? 'geoComment' : 'comment' 

     return api[postType].new.useMutation({
        onMutate: async (postData) => {
            if(page === 'user' && profileId){
            trpc.userQuery.getUserPosts.cancel()
            trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, (data: any) => {
                return handleOptimisticPostUpdate(data, postid, profile, postData)
 
                    }) 
                }
    if(page === 'dashboard' ){     
        trpc.feed.getFollowerFeed.cancel()
             trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5},
             (data: any) => {
                    if(data){
                        return handleOptimisticPostUpdate(data, postid, profile, postData)
                    }
                })

        trpc.feed.getGeoFeed_current.cancel()
            trpc.feed.getGeoFeed_current.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
             (data: any) => {
                    if(data){
                        return handleOptimisticPostUpdate(data, postid, profile, postData)
                    }
                })
            }
                   
        trpc.feed.getGeoFeed_home.cancel()
            trpc.feed.getGeoFeed_home.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
             (data: any) => {
                    if(data){
                        return handleOptimisticPostUpdate(data, postid, profile, postData)
                    }
                })
            
        trpc.feed.getActivityFeed.cancel()
            trpc.feed.getActivityFeed.setInfiniteData(
                {},
             (data: any) => {
                    if(data){
                        return handleOptimisticPostUpdate(data, postid, profile, postData)
                    }
                })
                        

                 
            },
            onError: () => {
                toast.error('error creating comment')
            },
            onSuccess: () => {
            if(page === 'user' && profileId){
                trpc.userQuery.getUserPosts.invalidate()
        }
            if(page === 'dashboard' && procedure === 'getFollowerFeed'){
                trpc.feed.getFollowerFeed.invalidate()
        }
            if(page === 'dashboard' && procedure === 'getGeoFeed_current'){
                trpc.feed.getGeoFeed_current.invalidate()
        }
            if(page === 'dashboard' && procedure === 'getGeoFeed_home'){
                trpc.feed.getGeoFeed_home.invalidate()
        }
            if(page === 'dashboard' && procedure === 'getActivityFeed'){
                trpc.feed.getActivityFeed.invalidate()

        }
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