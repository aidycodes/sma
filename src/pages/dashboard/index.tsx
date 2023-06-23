import { useAtom } from 'jotai'
import Link from 'next/link'
import React from 'react'
import Feed from '~/components/feed'
import GeoFeed from '~/components/geofeed/currentLocation'
import Loading from '~/components/loading'
import { useGeolocation } from '~/hooks/useGeolocation'
import { FeedDirectorAtom } from '~/jotai/store'
import { api } from '~/utils/api'
import CreatePost from '~/components/dashboard/createpost'
import LocationDisplay from '~/components/dashboard/locationDisplay'
import FeedSelector from '~/components/dashboard/feedSelector'
import useActivityFeed from '~/hooks/api/feeds/useActivityFeed'
import FeedDisplay from '~/components/dashboard/feedSelector/feedDisplay'


const Dashboard = () => {


      const [feed, setFeed] = React.useState('following')
      const [disableLocationDisplay, setDisableLocationDisplay] = React.useState(false)

      const {lat , lng, isLoading } = useGeolocation()
      const { data, isLoading:locationLoading } = api.geoCode.reverseGeoCode.useQuery({lat: lat, lng: lng})

      const { hasNextPage } = useActivityFeed()

     // const { data:feedData, isLoading:feedLoading } = api.feed.getActivityFeed.useQuery()
      if(isLoading) return null

  return (
        <div className="  w-full h-full lg:w-3/4 2xl:w-1/2 my-32 mx-auto ">
          {feed === 'current' && !disableLocationDisplay ? 
          <LocationDisplay {...data?.geoUser} isGeo={lat ? true : false} isLoading={locationLoading}
            disable={setDisableLocationDisplay}/> 
            : <div className="py-[10px]"></div>
  }
     
        <FeedSelector setFeed={setFeed} feed={feed}/>
        <CreatePost/>  
    
        <FeedDisplay feed={feed} lat={lat} lng={lng}/>
       
    </div>
  )
}


import { prisma } from '~/server/db';
import { auth } from 'auth/lucia';
import SuperJSON from 'superjson';
import { GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root'
import AdditionalOptions from '~/components/dashboard/AdditionalOptions'



export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl}) => {


    const authRequest = auth.handleRequest(req, res)
    const session = await authRequest.validateUser();

    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, currentUser: session, res, authRequest },
        transformer: SuperJSON
    })
        if(session && session.user) {
    await ssg.userQuery.getUserProfile.prefetch()

    return {
        props: {
            trpcState: ssg.dehydrate(),
            serverTheme:'dark-blue'
            }
        }   
    }
    return {
        redirect:{
            permanent:false,
            destination:"/login"
        },
        props:{
            resolvedUrl
        }
    }
}

export default Dashboard

/*
  
            */