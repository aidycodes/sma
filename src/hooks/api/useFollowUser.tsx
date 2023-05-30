import { FollowInfo } from "~/components/profile"
import { api } from "~/utils/api"


const useFollowUser = (userid: string) => {

    const trpc = api.useContext()
     
    const followUser = api.follow.followUser.useMutation({
        onMutate: async () => {
        trpc.follow.isFollowerFollowing.cancel({id:userid})
          const prevData = trpc.follow.isFollowerFollowing.getData()
            trpc.follow.isFollowerFollowing.setData({id:userid}, (oldData) => {
                const data = oldData as FollowInfo
                return {
                    ...data,
                    followsUser: true
                }

            })
               return { prevData }
    },
    onError: async (error, variables, context) => {
        trpc.follow.isFollowerFollowing.setData({id:userid}, (oldData) => {
            const data = oldData as FollowInfo
            return {
                ...data,
                followsUser: false
            }

        })
    },
    onSettled: async (data, error, variables) => {
     
          trpc.follow.isFollowerFollowing.invalidate({id:userid})
    }
})
   return { followUser }
}

export default useFollowUser