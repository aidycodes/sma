import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { currentLocationAtom, FeedDirectorAtom, whereToPostAtom } from "~/jotai/store"
import { api } from "~/utils/api"
import useCurrentUserProfile from "./useCurrentUserProfile"

export const useSubmitPostFollowers = () => {
    
    const trpc = api.useContext()
    const [ whereToPost ] = useAtom(whereToPostAtom)
    const profile = useCurrentUserProfile()
 
    return api.post.new.useMutation({
        onMutate: (newPost) => {
                trpc.feed.getFollowerFeed.cancel()
            const previousData = trpc.feed.getFollowerFeed.getData({postAmt:5})
                trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (oldData: any) => {
                    if(oldData){
                        return opitmisticPost(newPost, oldData, profile)
                    }
                })
                return { previousData }
        },
        onError: (err, variables, context) => {
            console.log(variables, context)
            trpc.feed.getFollowerFeed.setData({postAmt:5}, context?.previousData)
            toast.error('Error submitting post')
    },
        onSuccess: () => {
            trpc.feed.getFollowerFeed.invalidate()
        }
    })
}

export const useSubmitPostGeo = () => {
    
    const trpc = api.useContext()
    const [ whereToPost ] = useAtom(whereToPostAtom)
    const [ currentLocation ] = useAtom(currentLocationAtom)

    const profile = useCurrentUserProfile()
    const feed = whereToPost === 'Current Location' ? 'getGeoFeed_current' : 'route'
    return api.geoPost.new.useMutation({
         onMutate: async(newPost) => {
        await trpc.feed.getGeoFeed_current.cancel()
        const previousData = trpc.feed.getGeoFeed_current.getInfiniteData({lat:currentLocation?.lat, lng:currentLocation?.lng})
        console.log({previousData})
            if(whereToPost === 'Current Location'){
                
          
                trpc.feed.getGeoFeed_current.setInfiniteData({lat:currentLocation?.lat, lng:currentLocation?.lng}, (oldData: any) => {
                    if(oldData){
                        return opitmisticPost(newPost, oldData, profile)
                    }
                })
               
            }
       
             return { previousData }
        },
        onError: (err, variables, context) => {
            console.log(variables, context)
            trpc.feed.getGeoFeed_current.setInfiniteData({lat:currentLocation?.lat, lng:currentLocation?.lng}, context?.previousData)
            toast.error('Error submitting post')
    },
        onSuccess: () => {
            trpc.feed.getGeoFeed_current.invalidate()
        }
    })
}


function opitmisticPost(newPost: any, oldData: any, profile: any) {
           const updatedPage = oldData.pages.map((page: any, i: number) => {
                           return i === 0 ? {...page,
                             posts:[{...newPost, userid:profile?.userid, 
                                user:{profile, id:profile?.userid}, comments:[], likes:[], likes_cnt:0, comment_cnt:0, postid:'optimistic' } 
                                ,...page.posts]} : page 
                        }
                            )
                            console.log({oldData}, {...oldData, pages: updatedPage})
                            return {...oldData, pages: updatedPage}
    }
