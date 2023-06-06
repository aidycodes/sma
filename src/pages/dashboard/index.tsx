import React from 'react'
import Feed from '~/components/feed'
import GeoFeed from '~/components/geofeed'
import Layout from '~/components/Layout'
import { useGeolocation } from '~/hooks/useGeolocation'
import { api } from '~/utils/api'

const Dashboard = () => {

      const [feed, setFeed] = React.useState(true)

      const {lat , lng, isLoading } = useGeolocation()
      console.log(lat, lng, isLoading)
      const stringLocation = api.geoCode.reverseGeoCode.useQuery({lat: lat, lng: lng})
      console.log(stringLocation)

  return (
        <div className="  w-full h-full lg:w-3/4 2xl:w-1/2 my-32 mx-auto ">
                  <button className="p-4 rounded-[100px] bg-blue-700 " onClick={() => setFeed(!feed)}>{feed ? 'Follow' : 'Geo'}</button>
            {!feed
              ?
        <Feed/>
        :
         lat && lng ?
         <div>
            <div className="text-center text-xl ">Your Location</div>
            <div className="text-center text-xl font-semibold">{stringLocation.data?.geoUser.streetName}</div>
            <div className="text-center text-xl font-semibold">{stringLocation.data?.geoUser.city}</div>
            <div className="text-center text-xl font-semibold">{stringLocation.data?.geoUser.county}</div>
            <div className="text-center text-xl font-semibold">{stringLocation.data?.geoUser.state}</div>


        <GeoFeed lat={lat} lng={lng} />
        </div>
        : 
        <div className="mt-16">you must enable your location settings</div>
   
            }
       
    </div>
  )
}

export default Dashboard