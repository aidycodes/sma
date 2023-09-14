import { useRouter } from 'next/router'
import React from 'react'
import Login from '~/components/Login'
import VerifyEmail from '~/components/Login/verifyEmail'
import Modal from '~/components/modal'
import LoggedOutNav from '~/components/navbar/LoggedOutNavBar'

const LoginPage = () => {


    const router = useRouter()
    const { verify } = router.query

    const [isFlipped, setIsFlipped] = React.useState( verify ? false : true)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if(count >= 2){
            setIsFlipped(true)
            }
            setCount(count + 1)
        }, 500);
        return () => clearTimeout(timer)
    }, [verify])

  return (
    <>
    <LoggedOutNav/>
    <div className="  w-full h-full lg:w-3/4 2xl:w-1/2 my-28 mx-auto ">

        <Login setIsFlipped={setIsFlipped} isFlipped={isFlipped} />
        {verify && <Modal component={<VerifyEmail />}/> }
    </div>
    </>
  )
}

import { prisma } from '~/server/db';
import { auth } from 'auth/lucia';
import SuperJSON from 'superjson';
import { GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root'
import Navbar from '~/components/navbar'


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
      redirect: {
        permanent: false,
        destination: '/dashboard',
      },
        props: {
            trpcState: ssg.dehydrate(),
            serverTheme:'dark-blue'
            }
        }   
    }
    return {
        props:{
            resolvedUrl
        }
    }
}

export default LoginPage