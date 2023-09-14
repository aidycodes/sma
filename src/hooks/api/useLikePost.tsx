import { useAtom } from "jotai";
import { ActivityFeedAtom, currentLocationAtom, FeedDirectorAtom, radiusAtom } from "~/jotai/store";
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
    const [page, queryParam] = params.asPath.substr(1).split('/')
    const [ [, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)
    const [ radius ] = useAtom(radiusAtom)
    const [activityFeed, setActivityFeed] = useAtom(ActivityFeedAtom)
    const { data } = api.userQuery.getUsersGeoData.useQuery()



    const postType = type === 'geo' ? 'geoPost' : 'post' 

    return api[postType].like.useMutation({
      onMutate: (likedPost) => {
        if(page === 'user' && queryParam){
            trpc.userQuery.getUserPosts.cancel()
            trpc.userQuery.getUserPosts.setInfiniteData({id:queryParam, postAmt:3},
             (old: any) => {
                if(old){  
                    const updatedPages = updateLike(old, likedPost, profile)
                    return {...old, pages: updatedPages}
                }            
        }) }
        if(page === 'geopost'){
            trpc.geoPost.getPost.cancel()
          
           trpc.geoPost.getPost.setData({postid:queryParam}, (data: any) => {
               if(data){
              
                   return { post:{...data.post, postid:'optimistic', likes_cnt: data.post.likes_cnt + 1, likes:[...data.post.likes, {user:
                                        {profile:{userid:profile?.userid, userName:profile?.username, avatar:profile?.avatar}}}
                                    ]}}
               }
        
            })
        }
        if(page === 'post'){
            trpc.post.getPost.cancel()
          
           trpc.post.getPost.setData({postid:queryParam}, (data: any) => {
               if(data){
              
                   return { post:{...data.post, postid:'optimistic', likes_cnt: data.post.likes_cnt + 1, likes:[...data.post.likes, {user:
                                        {profile:{userid:profile?.userid, userName:profile?.username, avatar:profile?.avatar}}}
                                    ]}}
               }
        
            })
        }

        if(page === 'dashboard'){
              trpc.feed.getActivityFeed.cancel()
               const updatedPages = updateLikeMergedFeed(activityFeed, likedPost, profile)
              setActivityFeed(updatedPages)
                trpc.feed.getActivityFeed.setInfiniteData({}, (oldData: any) => {
                    if(oldData){
                        const updatedPages = updateLike(oldData, likedPost, profile)
                        return {...oldData, pages: updatedPages}

                    }
                })
                  trpc.feed.getGeoFeed_home.cancel()
                trpc.feed.getGeoFeed_home.setInfiniteData({lat:data?.geoData?.lat, lng:data?.geoData?.lng, radius:radius}, (oldData: any) => {
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
        onSettled: (data, variables, context) => {
            if(page === 'user' && queryParam){
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
            if(page === 'geopost'){
                trpc.geoPost.getPost.invalidate()
            }
            if(page === 'post'){
                trpc.post.getPost.invalidate()
            }
    }
    })
}

export default useLikePost


function updateLike(oldData: any, likedPost: any, profile: any) {
                      const updatedPages = oldData.pages.map((page: any) => {
                        const updatedPosts = page.posts.map((post: any) => {
                            if(post.postid === likedPost.postid){
                                return {...post, optimistic:true, likes_cnt: post.likes_cnt + 1,
                                    likes: [...post.likes, {user:
                                        {profile:{userid:profile.userid, userName:profile.username, avatar:profile.avatar} }
                                        }]}
                            }
                            return post
                        })
                        return {...page, posts: updatedPosts}
                    })
                    return updatedPages
                }

function updateLikeMergedFeed(oldData: any, likedPost: any, profile: any) {
                      console.log(oldData)
                        return oldData.map((post: any) => {
                            if(post.postid === likedPost.postid){
                                return {...post, optimistic:true, likes_cnt: post.likes_cnt + 1,
                                    likes: [...post.likes, {user:
                                        {profile:{userid:profile.userid, userName:profile.username, avatar:profile.avatar} }
                                        }]}
                            }
                            return post
                        })
                       
                }
