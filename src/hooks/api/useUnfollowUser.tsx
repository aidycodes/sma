import { FollowInfo } from "~/components/profile"
import { api } from "~/utils/api"


const useUnfollowUser = (userid: string) => {

    const trpc = api.useContext()
     const unFollowUser = api.follow.unfollowUser.useMutation({
        onMutate: async () => {
            await trpc.follow.isFollowerFollowing.cancel({id:userid})
            const prevData = trpc.follow.isFollowerFollowing.getData()
            trpc.follow.isFollowerFollowing.setData({id:userid}, (oldData) => {
          
                const data = oldData as FollowInfo
                return {
                    ...data,
                    followsUser: false
                }
            })
            return { prevData }
    },
    onError: async (error, variables, context) => {
        if(context?.prevData){
        trpc.follow.isFollowerFollowing.setData({id:userid}, context.prevData)
        }
    },
    onSettled: async () => {
        trpc.follow.isFollowerFollowing.invalidate({id:userid})    
    }
})
    return { unFollowUser }
}

export default useUnfollowUser