import { api } from "~/utils/api"


const useCurrentUserProfile = () => {

    const trpc = api.useContext()
    const { data:{user:{profile}} } = api.userQuery.getUserProfile.useQuery()

    return profile
}

export default useCurrentUserProfile