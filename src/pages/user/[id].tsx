import React from 'react'
import PageError from '~/components/error'
import Layout from '~/components/Layout'
import { api } from '~/utils/api'
import Banner from '~/components/profile/banner'
import { useRouter } from 'next/router'
import { appRouter } from '~/server/api/root';
import { useSSRTheme } from '~/hooks/useSSRTheme'
import { getQueryKey } from '@trpc/react-query'
import { useTheme } from 'next-themes'
import Profile from '~/components/profile'
import useIsFollowerFollowing  from '../../hooks/api/useIsFollowerFollowing'

const UserPage = () => {

    const { theme } = useTheme()
    const [isMounted, setIsMounted] = React.useState(false)
    const router = useRouter()
    const  id  = router.query.id as string 

   const { data, isLoading, isError } = api.userQuery.getProfile.useQuery({id:id})
   const profileQueryKey = getQueryKey(api.userQuery.getProfile, {id:id}, 'query')

   const { data: userData, isLoading: userLoading, isError: userError } = api.userQuery.getUserProfile.useQuery()
   const userQueryKey = getQueryKey(api.userQuery.getUserProfile, undefined, 'query')
 
    const { data: followInfo } = useIsFollowerFollowing(id)

   const user = userData?.user
   const profile = data
   const [, setValue] = useAtom(FeedDirectorAtom)

    useSSRTheme(user?.profile?.theme)
    React.useLayoutEffect(() => {
    setIsMounted(true)
     setValue(['feed', 'getProfileFeed'])   
 }, [])
        if(!isMounted) return null

    if(!user || !profile || !followInfo) {
        return (
            <Layout>
                <PageError isLoading={[isLoading]} queryKeys={[profileQueryKey, userQueryKey]} isError={[isError, userError]}/>
            </Layout>
        )}
  

  return (
    <ProfileLayout>
        <div className="  w-full h-full 2xl:w-11/12 ">
            <div className="flex flex-col items-center justify-center">
               <Banner image={profile?.cover}/>
               </div>
           <Profile {...profile} {...followInfo} userid={id}/>   
        </div>
  
    </ProfileLayout>
  )
}

export default UserPage


import { prisma } from '~/server/db';
import { auth } from 'auth/lucia';
import SuperJSON from 'superjson';
import { GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import ProfileLayout from '~/components/profile/ProfileLayout'
import { useAtom } from 'jotai'
import { FeedDirectorAtom } from '~/jotai/store'






export const getServerSideProps: GetServerSideProps = async ({ req, res, params, resolvedUrl}) => {


    const authRequest = auth.handleRequest(req, res)
    const session = await authRequest.validateUser();

    const id = params?.id as string
    const ssg = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, currentUser: session, res, authRequest },
        transformer: SuperJSON
    })
        if(session && session.user) {
    await ssg.userQuery.getUserProfile.prefetch()
    if(id){
   const profile = await ssg.userQuery.getProfile.prefetch({id})
    await ssg.follow.isFollowerFollowing.prefetch({id})
    }
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