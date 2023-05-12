import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { socket } from '~/socket/clientSocket';

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


export default function Notifcation() {

    const notify = (notification: Notification) => toast(
        <span>
            <Link href={`/${notification.type}/${notification.relativeId}`} >
                {notification.content}
            </Link>
        </span>, {
        icon: typeEmoji[notification.type],
    });
    const [notifcationFix, setNotifcationFix] = useState(false);

    useEffect(() => {        
        socket.connect()
        socket.once('notification', (data) => {
            const notification: Notification = JSON.parse(data.payload)
            console.log(data)
            setNotifcationFix(!notifcationFix)
           notify(notification)
        })
        return () => {
            socket?.off('notification')
            socket.disconnect()
        }
    }, [notifcationFix])

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