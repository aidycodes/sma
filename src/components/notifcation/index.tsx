import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FeedDirectorAtom } from '~/jotai/store';
import { socket } from '~/socket/clientSocket';
import { api } from '~/utils/api';

export const typeEmoji: {[index: string]: string} = {
    'likepost': '👍',
    'likegeopost': '👍',
    'likecomment': '👍',
    'likegeocomment': '👍',
    'comment': '💬',
    'geocomment': '💬',
    'follow': '👤',
    'post': '📌',
}

type Notification = {
    type: string,
    content: string,
    relativeid: string,
    commentid: string,
    path: string
} 


export default function Notifcation() {

    const trpc = api.useContext()
    const router = useRouter()
    const [ [, feed] ] = useAtom(FeedDirectorAtom)

    const notify = (notification: Notification, path: string) => {
        if(notification.type === 'post' || notification.type === 'likepost' ||
        notification.type === 'geopost' || notification.type === 'likegeopost' ){ 
        return(
        toast(
        <span>
            <Link href={`/${path}/${notification.relativeid}`} >
                {notification.content}
            </Link>
        </span>, {
        icon: typeEmoji[notification.type],
    })
        )
    }
    if(notification.type === 'comment' || notification.type === 'likecomment'){
        return(
        toast(
        <span>
            <Link href={`/post/${notification.relativeid}/${notification.commentid}`} >
                {notification.content}
            </Link>
        </span>, {
        icon: typeEmoji[notification.type],
    })
        )
    }
    if(notification.type === 'geocomment' || notification.type === 'likegeocomment'){
        return(
        toast(
        <span>
            <Link href={`/geopost/${notification.relativeid}/${notification.commentid}`} >
                {notification.content}
            </Link>
        </span>, {
        icon: typeEmoji[notification.type],
    })
        )
    }
}
    const [notifcationFix, setNotifcationFix] = useState(false);
    const [chatFix, setChatFix] = useState(false);

    useEffect(() => {
        socket.connect()
        return () => {
            socket.disconnect()
        }
    },[])

    useEffect(() => {
        socket.connect()        
        socket.once('notification', (data) => {

            const notification: Notification = JSON.parse(data.payload)
          
            trpc.userQuery.getNotifcations.invalidate()
            setNotifcationFix(!notifcationFix)
           notify(notification, data.path)
       console.log(router)
           if(router.route === 'profile'){
               trpc.userQuery.getProfile.invalidate({userid: router?.query?.userid as string})
           }
           if(router.route === '/post/[...id]'){
               trpc.post.getPost.invalidate({postid: router?.query?.id[0] as string})
           }
            if(router.route === '/geopost/[...id]'){
                trpc.geoPost.getPost.invalidate({postid: router?.query?.id[0] as string})
            }
            if(router.route === 'dashboard'){
                if(feed === 'following'){
                    trpc.feed.getFollowerFeed.invalidate()
                }
                if(feed === 'getGeoFeed_current'){
                    trpc.feed.getGeoFeed_current.invalidate()
                }
                if(feed === 'getGeoFeed_home'){
                    trpc.feed.getGeoFeed_home.invalidate()
                }
                if(feed === 'getActivityFeed'){
                    trpc.feed.getActivityFeed.invalidate()
                }

            }
                
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
        
                trpc.chat.getMessages.setInfiniteData({chatId:data.payload.chatid}, (oldData) => {
                 
                    if(oldData){
                       
    const dummyMessage = {
          messageid: data.payload.messageid,
          content: data.payload.content,
          userid: data?.user?.profile?.userid as string,
          user: {...data.user.profile},
          chatid: data.payload.chatId,
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
            
    toast(
        <span>
            <Link href={`/chat/${data.payload.chatid}`} >
                <div className="flex p-1 items-center gap-4">                    
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