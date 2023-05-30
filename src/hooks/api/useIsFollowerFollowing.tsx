import { api } from "~/utils/api"


const useIsFollowerFollowing = (userid: string) =>  api.follow.isFollowerFollowing.useQuery({id:userid})

export default useIsFollowerFollowing