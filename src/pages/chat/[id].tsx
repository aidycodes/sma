import React from 'react'
import Chat from '~/components/chat/chatbox'
import ContactList from '~/components/chat/contactList'
import NewChatModal from '~/components/chat/newchat/NewChatModel'
import Navbar from '~/components/navbar'
import { useSSRTheme } from '~/hooks/useSSRTheme'

export type SetCreateMessage = React.Dispatch<React.SetStateAction<boolean>>

const ChatPage = () => {

    const [createMessage, setCreateMessage] = React.useState(false)
     useSSRTheme()

  return (
    <div>
      <Navbar/>
    <div className="mt-16 lg:mt-20  w-full h-[calc(100vh-80px)]  mx-auto overflow-y-hidden">
        <div className="h-screen flex">
        <ContactList setCreateMessage={setCreateMessage} createMessage={createMessage} />
        <Chat/>
        </div>
        {createMessage && <NewChatModal setCreateMessage={setCreateMessage} />}
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

export default ChatPage