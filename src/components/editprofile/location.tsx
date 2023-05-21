import { GeoUser } from '@prisma/client'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { getQueryClient } from '@trpc/react-query/shared'
import { useTheme } from 'next-themes'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useGeolocation } from '~/hooks/useGeolocation'
import { api } from '~/utils/api'
import DisplayLocation from './location-panel'
import LocationItem from './location-panel/locationItem'



type LocationInfomation = {
    city: string
    country: string
    county: string
    state: string
}

type LocationProps = {
    geoData: GeoUser
}
type VerifiedGeoUser = {
    lat: number
    lng: number
    country?: string
    county?: string
    state?: string
}

const verifiedGeoUser = (geoUser: GeoUser) => {
    if(geoUser.lat && geoUser.lng) {
        return geoUser as VerifiedGeoUser
    } else {
        return false
    }
}

const Location = ( {geoquery, loading}:
     {geoquery: GeoUser, loading: boolean} ) => {

    const {lat, lng} = useGeolocation()
    const queryClient = useQueryClient()
    const { theme } = useTheme()
    const querykey = getQueryKey(api.userQuery.getUsersGeoData, undefined, 'query')
    const updateLocation = api.user.updateGeoUser.useMutation({
                                        onSuccess: () => toast.success('Location Updated'),
                                        onError: (previousData, ctx) => { 
                                            toast.error('Failed to update location')
                                        },
                                        onSettled: () => queryClient.invalidateQueries(querykey),
                                        onMutate: (newGeoUser) => {
                                            queryClient.setQueryData(querykey, {geoData:newGeoUser})
                                        }
                                    })
    const { data, isLoading } = api.geoCode.reverseGeoCode.useQuery({lat: lat, lng: lng}) 
    
   
    const currentLocation = data?.geoUser
 
    const getCurrentLocation = async () => {
        queryClient.fetchQuery(querykey)
    }
    


  return (
    <div className={`fg p-8 rounded-md shadow-md mt-12 flex flex-col ${theme === 'dark-blue' && 'items-center'}  `}>
        <h1 className="text-center pb-4 font-semibold tracking-widest">Location</h1>
            <div className="flex justify-center ">
    <div className="flex flex-col justify-center items-center gap-4 w-full mb-4 ">
        <DisplayLocation data={geoquery} isLoading={loading} type={"Primary"} />  
       
       <DisplayLocation data={currentLocation} isLoading={isLoading} type={"Current"}/> 
    </div>  
    </div>
    <div className="flex justify-center">
            <button className="bg-blue-700 p-2 rounded-md  text-slate-300 hover:text-slate-200 hover:bg-blue-600" 
            onClick={async() => {
                if(currentLocation){
                    const checkedGeoUser = verifiedGeoUser(currentLocation)
                if(checkedGeoUser) {
                     updateLocation.mutate(checkedGeoUser)
                }
                } else{
                    return toast.error('No Location Data')
                    }
                }}
            >
                Update Location
            </button>
        </div> 
      </div>      

    
        
  
  )
}

export default Location