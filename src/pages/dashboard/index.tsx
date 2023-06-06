import { useAtom } from 'jotai'
import Link from 'next/link'
import React from 'react'
import Feed from '~/components/feed'
import GeoFeed from '~/components/geofeed'
import Layout from '~/components/Layout'
import Loading from '~/components/loading'
import { useGeolocation } from '~/hooks/useGeolocation'
import { FeedDirectorAtom } from '~/jotai/store'
import { api } from '~/utils/api'

const Dashboard = () => {

      const [feed, setFeed] = React.useState(true)
       const [, setValue] = useAtom(FeedDirectorAtom)

       const handleCurrentFeed = () => {
        if(feed){
          setFeed(!feed)
          setValue(['feed', 'getFollowerFeed'])
        } else {
          setFeed(!feed)
          setValue(['geo', 'getGeoFeed_current'])
        }
       }

      const {lat , lng, isLoading } = useGeolocation()
      console.log(lat, lng, isLoading)
      const { data, isLoading:locationLoading } = api.geoCode.reverseGeoCode.useQuery({lat: lat, lng: lng})
      if(isLoading) return <Loading/>

  return (
        <div className="  w-full h-full lg:w-3/4 2xl:w-1/2 my-32 mx-auto ">
                  <button className="p-4 rounded-[100px] bg-blue-700 " onClick={() => handleCurrentFeed()}>{feed ? 'Follow' : 'Geo'}</button>
                   <Link href={`/user/Q7tMwuMnhQ1sNIX`}>
                   <button className="p-4 rounded-[100px] bg-blue-700 ">{'move to profile'}</button>
                   </Link>
            {!feed
              ?
        <Feed/>
        :
         lat && lng ?
         <div>
            <div className="text-center text-xl ">Your Location</div>
            <div className="text-center text-xl font-semibold">{data?.geoUser.streetName}</div>
            <div className="text-center text-xl font-semibold">{data?.geoUser.city}</div>
            <div className="text-center text-xl font-semibold">{data?.geoUser.county}</div>
            <div className="text-center text-xl font-semibold">{data?.geoUser.state}</div>


        <GeoFeed lat={lat} lng={lng} />
        </div>
        : 
        <div className="mt-16">you must enable your location settings</div>
   
            }
       
    </div>
  )
}

export default Dashboard