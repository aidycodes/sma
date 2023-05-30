import React from 'react'
import Details from '~/components/editprofile/details';
import Images from '~/components/editprofile/images';
import Location from '~/components/editprofile/location';
import Layout from '~/components/Layout';
import Tabs from '~/components/tabs';
import { useSSRTheme } from '~/hooks/useSSRTheme';
import { api } from '~/utils/api';
import PageError from '~/components/error';
import { getQueryKey } from '@trpc/react-query';

const tabButtons = require('./tab-buttons.json')

const EditProfile = () => {

   
     const createProfile = api.user.createGeoUser.useMutation()
    const { data, isLoading, isError } = api.userQuery.getUserProfile.useQuery()
    const {data: geoquery, isLoading: geoQueryLoading, isError: isErrorGeo } = api.userQuery.getUsersGeoData.useQuery()

    const profileQueryKey = getQueryKey(api.userQuery.getUserProfile, undefined, 'query')
    const geoQueryKey = getQueryKey(api.userQuery.getUsersGeoData, undefined, 'query')

    const user = data?.user?.profile
    const geoData = geoquery?.geoData

    useSSRTheme(user?.theme ? user.theme : 'light')
   if(!user || !geoData) {
    return (
    <Layout>
        <PageError isLoading={[isLoading, geoQueryLoading]} queryKeys={[profileQueryKey, geoQueryKey]} isError={[isError, isErrorGeo ]}/>
    </Layout>
    )}

  return (
    <Layout>
            <Tabs tabs={tabButtons} >
                {[<Details {...user}  />,<Images {...user}/>,<Location geoquery={geoData} loading={geoQueryLoading} />]}
            </Tabs>
  

    </Layout>
  )
    
}

import { prisma } from '~/server/db';
import { auth } from 'auth/lucia';
import SuperJSON from 'superjson';
import { GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';

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
    await ssg.userQuery.getUsersGeoData.prefetch()
        
    return {
        props: {
            trpcState: ssg.dehydrate(),
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

export default EditProfile