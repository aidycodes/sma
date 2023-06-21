import { api } from "~/utils/api"


const useCurrentUserProfile = () => {

    const trpc = api.useContext()
    const { data } = api.userQuery.getUserProfile.useQuery()

    return data?.user?.profile
}

export default useCurrentUserProfile