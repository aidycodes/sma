import { api } from "~/utils/api"

const useCurrentUserProfile = () => {

    const { data } = api.userQuery.getUserProfile.useQuery()

    return data?.user?.profile
}

export default useCurrentUserProfile