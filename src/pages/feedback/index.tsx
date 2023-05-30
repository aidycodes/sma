import React from 'react'
import { api } from '~/utils/api';
import Layout from '~/components/Layout';
import Card from '~/components/error/card';
import Image from 'next/image';
import SubmitButton from '~/components/submitbutton';
import { useTheme } from 'next-themes';
import { useSSRTheme } from '~/hooks/useSSRTheme';
import PageError from '~/components/error';
import { getQueryKey } from '@trpc/react-query';


const FeedbackPage = () => {
  
    const { theme } = useTheme()

    const [isMounted, setIsMounted] = React.useState(false)

   const { data, isLoading, isError } = api.userQuery.getUserProfile.useQuery()
   const profileQueryKey = getQueryKey(api.userQuery.getUserProfile, undefined, 'query')

   const user = data?.user?.profile
    useSSRTheme(user?.theme)
    React.useLayoutEffect(() => {
    setIsMounted(true)
 }, [])
        if(!isMounted) return null
 
    if(!user) {
        return (
            <Layout>
                <PageError isLoading={[isLoading]} queryKeys={[profileQueryKey]} isError={[isError]}/>
            </Layout>
        )}
          
          
  return (
    <Layout>
        <Card>
            <div className="flex justify-center font-semibold text-xl tracking-wider pb-4">
            <h1>Feedback</h1>
            </div>
            <div className={`flex flex-col p-8  shadow-xl ${theme === 'light' || theme === 'lightFix' ? 'highlight-1 sticky-content text-slate-700' :
       theme === 'dark' || theme === 'darkFix' ? 'highlight-1 sticky-content-dark' :
       theme === 'dark-blue' || theme === 'dark-blueFix' ? 'highlight-1 border-blue-600 border-2 ' :
       'highlight sticky-content'}
         p-2 w-fit  rounded-lg   `}>
                <div className="flex flex-col gap-4 ">
          
            <div className="flex items-center gap-8 w-[240px] ">
                <Image className="rounded-[50px] w-16 h-16" src={user?.avatar ? user.avatar : '/icons/user.svg'} 
                alt="avatar" width={50} height={50} />
            <h2> {user?.username} </h2>
            </div>
            <p> Tell us what you think!</p>
        <textarea />
            <SubmitButton label="Send" />
        </div>

        </div>
        
        </Card>
    </Layout>
  )
}

export default FeedbackPage

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