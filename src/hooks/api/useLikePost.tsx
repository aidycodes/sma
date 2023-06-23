import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom, radiusAtom } from "~/jotai/store";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast"
import { api } from "~/utils/api"
import useCurrentUserProfile from "./useCurrentUserProfile"

export type Cursor = {
    created_at: Date;
    postid: string;
}

const useLikePost = (type: string = 'normal') => {

    const trpc = api.useContext()
    const profile = useCurrentUserProfile()
    const params = useRouter()
    const [page, profileId] = params.asPath.substr(1).split('/')
    const [ [, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)
    const [ radius ] = useAtom(radiusAtom)

    const postType = type === 'geo' ? 'geoPost' : 'post' 

    return api[postType].like.useMutation({
      onMutate: (likedPost) => {
        if(page === 'user' && profileId){
            trpc.userQuery.getUserPosts.cancel()
            trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3},
             (old: any) => {
                if(old){  
                    const updatedPages = updateLike(old, likedPost, profile)
                    return {...old, pages: updatedPages}
                }            
        }) }

        if(page === 'dashboard'){
              trpc.feed.getActivityFeed.cancel()
                trpc.feed.getActivityFeed.setInfiniteData({}, (oldData: any) => {
                    if(oldData){
                        const updatedPages = updateLike(oldData, likedPost, profile)
                        return {...oldData, pages: updatedPages}

                    }
                })
                  trpc.feed.getGeoFeed_home.cancel()
                trpc.feed.getGeoFeed_home.setInfiniteData({lat:51.4545, lng:2.5879, radius:radius}, (oldData: any) => {
                    if(oldData){
                        const updatedPages = updateLike(oldData, likedPost, profile)
                        return {...oldData, pages: updatedPages}

                    }
                })
                  trpc.feed.getGeoFeed_current.cancel()
                trpc.feed.getGeoFeed_current.setInfiniteData({lat:currentLocation.lat, lng:currentLocation.lng, radius:radius}, (oldData: any) => {
                    if(oldData){
                        const updatedPages = updateLike(oldData, likedPost, profile)
                        return {...oldData, pages: updatedPages}

                    }
                })
                  trpc.feed.getFollowerFeed.cancel()
            trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (oldData: any) => {
                if(oldData){
                    const updatedPages = updateLike(oldData, likedPost, profile)
                    return {...oldData, pages: updatedPages}
                }
            })

                
        }
    },
        onError: (err, variables, context) => {
            toast.error('Error liking post')
        },
        onSuccess: (data, variables, context) => {
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

export default useLikePost


function updateLike(oldData: any, likedPost: any, profile: any) {
                      const updatedPages = oldData.pages.map((page: any) => {
                        const updatedPosts = page.posts.map((post: any) => {
                            if(post.postid === likedPost.postid){
                                return {...post, likes_cnt: post.likes_cnt + 1,
                                    likes: [...post.likes, {user:
                                        {profile:{userid:profile.userid, userName:profile.currentUser, avatar:profile.avatar} }
                                        }]}
                            }
                            return post
                        })
                        return {...page, posts: updatedPosts}
                    })
                    return updatedPages
                }
