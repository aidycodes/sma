import { QueryKey, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { socket } from '~/socket/clientSocket';
import { api } from '~/utils/api';

const typeEmoji: {[index: string]: string} = {
    'like': '👍',
    'comment': '💬',
    'follow': '👤',
    'mention': '📌',
    'reply': '📌',
    'repost': '📌',
    'user_post': '📌',
}

type Notification = {
    type: string,
    content: string,
    relativeId: string,
}

type Props = {
    queryKey: QueryKey
}


export default function Notifcation({ queryKey }: Props) {

    const queryClient = useQueryClient()
    const trpc = api.useContext()
    const router = useRouter()

    const notify = (notification: Notification) => toast(
        <span>
            <Link href={`/${notification.type}/${notification.relativeId}`} >
                {notification.content}
            </Link>
        </span>, {
        icon: typeEmoji[notification.type],
    });
    const [notifcationFix, setNotifcationFix] = useState(false);
    const [chatFix, setChatFix] = useState(false);

    useEffect(() => {        
        socket.connect()
      
        socket.once('notification', (data) => {
     
            const notification: Notification = JSON.parse(data.payload)
            queryClient.invalidateQueries({ queryKey: queryKey })
            setNotifcationFix(!notifcationFix)
           notify(notification)
        })
        return () => {
            socket?.off('notification')
            socket.disconnect()
        }
    }, [notifcationFix])

        useEffect(() => {        
        socket.connect()
        socket.once('chat', (data) => {
            trpc.chat.getChatList.invalidate()
            trpc.chat.getMessages.cancel({chatId:router.query.id as string})
            if(router.asPath === `/chat/${data.payload.chatid}`) {
                trpc.chat.getMessages.setInfiniteData({chatId:router.query.id as string}, (oldData) => {
                    if(oldData?.pages[0]?.messages){
    const dummyMessage = {
          messageid: 'optimistic',
          content: 'variables.message',
          userid: 'profile?.userid as string',
          user: {...data.user.profile},
          chatid: 'variables.chatId',
          viewed: false,
          created_at: new Date(),
          updated_at: new Date(),
        }
            const newPages = oldData.pages.map((page, i) => {
              if(i === 0 ){
                return {...page, messages: [...page?.messages, dummyMessage]}
              }
              return {...page}
            })   
          return {...oldData, pages: newPages  }
        }
                })
            }

             toast(
        <span>
            <Link href={`/chat/${data.payload.chatid}`} >
                <div className="flex items-center gap-4">                    
                    <Image src={data?.user?.profile?.avatar ? data?.user?.profile?.avatar : "/icons/user.svg" } 
                    width={30} height={30} alt='logo' className="rounded-[50px]" />
                    <div>
                        <div className="text-xs text-secondary"> {data?.user?.username}</div>
                    <div>{data.payload.content}</div>
                    </div>
                </div>
            </Link>
        </span>, 
             )
                trpc.chat.getMessages.invalidate({chatId:router.query.id as string})
         setChatFix(!chatFix)
    });
             
        return () => {
            socket?.off('chat')       
            socket.disconnect()
        }
    }, [chatFix])

    return (
        <div>
        <Toaster
                 position="top-right"
        toastOptions={{    
            style: {
                border: '1px solid #713200',
                padding: '16px',
                color: 'color: var(--text-primary)',
                background:'var(--foreground)'
            }}}
   
        />
        </div>
    );
    }