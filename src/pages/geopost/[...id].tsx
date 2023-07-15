import { useRouter } from 'next/router'
import React from 'react'
import SingleGeoPost from '~/components/SinglePost/SingleGeoPost'
import { useSSRTheme } from '~/hooks/useSSRTheme'
import Navbar from '~/components/navbar'

const GeoPostPage = () => {

    useSSRTheme()
    const { query } = useRouter()
  if(!query || !query?.id) return <div className="mt-20">no post</div>

return (
    <div>
        <Navbar/>
    <div className="  w-full h-full lg:w-3/4 2xl:w-1/2 my-28 mx-auto ">
      <SingleGeoPost postid={query?.id[0]} commentid={query?.id[1]} />
    </div>
    </div>
  )
}


import { prisma } from '~/server/db';
import { auth } from 'auth/lucia';
import SuperJSON from 'superjson';
import { GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root'

export const getServerSideProps: GetServerSideProps = async ({ req, res, params, resolvedUrl}) => {


    const authRequest = auth.handleRequest(req, res)
    const session = await authRequest.validateUser();
    const id = params?.id as string

    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, currentUser: session, res, authRequest },
        transformer: SuperJSON
    })
        if(session && session.user && id[0]) {
    await ssg.userQuery.getUserProfile.prefetch()
    await ssg.geoPost.getPost.prefetch({postid:id[0]})

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

export default GeoPostPage