import Link from 'next/link'
import React from 'react'
import Feed from '~/components/feed'
import ActivityFeed from '~/components/feed/activityFeed'
import GeoFeed from '~/components/geofeed/currentLocation'
import HomeFeed from '~/components/geofeed/homeLocation'
import { api } from '~/utils/api'
import FeedLoading from './feedLoading'

type FeedDisplayProps = {
    feed: string
    lat: number
    lng: number
}

const FeedDisplay = ({feed, lat, lng}: FeedDisplayProps) => {

    const { data:userHome, isLoading } = api.userQuery.getUsersGeoData.useQuery()


    if(feed === 'following') return <Feed/>
    if(feed === 'activity') return <ActivityFeed/>
    if(feed === 'home') {
         if(isLoading) return <div>loading...</div>
         if(!userHome?.geoData?.lat || !userHome?.geoData?.lng){ 
        return <div className="mt-16 fg p-8 text-center">You Need To Set Your Home Location in <Link href='/edit-profile'> Settings. </Link></div>
         } else {
            return <HomeFeed lat={userHome?.geoData?.lat} lng={userHome?.geoData?.lng} />
         }
    }
    
    if(feed === 'current' && !lat || !lng) return <div className="mt-16 fg p-8 text-center">You must enable your location settings.</div>
    if(feed === 'current') return <GeoFeed  lat={lat} lng={lng}/>
    
  return (
       <div className="mt-16 fg p-8 text-center">Error Loading Feeds.</div>
  )
}

export default FeedDisplay