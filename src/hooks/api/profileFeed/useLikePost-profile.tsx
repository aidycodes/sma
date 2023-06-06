import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom } from "~/jotai/store";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast"
import { api } from "~/utils/api"
import useCurrentUserProfile from "../useCurrentUserProfile"

export type Cursor = {
    created_at: Date;
    postid: string;
}

const useLikePost = () => {

    const trpc = api.useContext()
    const profile = useCurrentUserProfile()
    const params = useRouter()
    const [page, profileId] = params.asPath.substr(1).split('/')
    const [ [type, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)

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
        if(page === 'dashboard' && type !== 'geo'){
            trpc.feed.getFollowerFeed.cancel()
            trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (oldData: any) => {
                if(oldData){
                    const updatedPages = updateLike(oldData, likedPost, profile)
                    return {...oldData, pages: updatedPages}
                }
            })
        }
        if(page === 'dashboard' && type === 'geo' && currentLocation){
              trpc.feed.getGeoFeed_current.cancel()
                trpc.feed.getGeoFeed_current.setInfiniteData(currentLocation, (oldData: any) => {
                    if(oldData){
                        const updatedPages = updateLike(oldData, likedPost, profile)
                        return {...oldData, pages: updatedPages}

                    }
                })
            }
    },
        onError: (err, variables, context) => {
            trpc.userQuery.getUserPosts.invalidate()
            trpc.feed.getFollowerFeed.invalidate()
            trpc.feed.getGeoFeed_current.invalidate()
            toast.error('Error liking post')
        },
        onSuccess: (data, variables, context) => {
            trpc.userQuery.getUserPosts.invalidate()
            trpc.feed.getFollowerFeed.invalidate()
             trpc.feed.getGeoFeed_current.invalidate()
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
