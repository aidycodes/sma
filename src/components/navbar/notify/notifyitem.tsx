import { NotifyUser } from '@prisma/client'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'
import { api } from '~/utils/api'


type Props = {
    content: string
    type: string 
    link: string 
    viewed: boolean
    id: string
    queryKey?: QueryKey
    expanded?: boolean
    commentid?: string

}

type Note = {
    pages:Page[]
    pageParams:  NotifyUser[]
}
type Page = {
    notifcations: NotifyUser[]
    nextCursor: NotifyUser
}

const icontable: {[index: string]: string}  = {
    post: '📝',
    comment: '💬',
    geocomment: '💬',
    likepost: '👍',
    likegeopost: '👍',
    follow: '👤',
    user_mention: '📢',
    user_repost: '🔁',
    user_reply: '📩',
}



const Item = ({content, type, link, viewed, id, queryKey, commentid}: Props) => {


    const { theme } = useTheme()
     const queryClient = useQueryClient()
     const trpc = api.useContext()

    const hasViewed = api.notify.hasViewed.useMutation({
        async onMutate(data) {
            if(queryKey){
           const infiniteData = trpc.userQuery.getNotifcations.getInfiniteData({take:10})
                       
             const updatedNotes = infiniteData?.pages.map((page, i) => (
                {nextCursor: page?.nextCursor, notifcations:page?.notifcations.map((note) => (
                    note.nofiy_user_id === data.notify_user_id ? {...note, viewed: true} : note
                ))
                }
             ))   
                    console.log( {...infiniteData, pages:updatedNotes})
                    console.log(infiniteData)
                   trpc.userQuery.getNotifcations.setInfiniteData({take:10}, {...infiniteData, pages:updatedNotes})

        }
    },
        onError(err, newTodo, context) {

        },
        onSuccess(data) {
            trpc.userQuery.getNotifcations.invalidate({take:10})
        }
    })

    if(type === 'post' || type === 'likepost'){
        return(
    <Link href={!commentid ? `/post/${link}` : `/post/${link}/${commentid}` }>
        <div  className={!viewed ? `shadow-sm highlight mx-0 px-6 py-2 flex cursor-pointer` : 
    `${theme}-menu shadow-sm py-2 mx-0 px-6 flex  cursor-pointer`}
        onMouseOver={() => id && !viewed && hasViewed.mutate({notify_user_id: id})}
    >
        
        {type &&
        <div className="flex items-center p-1">
        {icontable[type]}
        </div>
        }
 
        <div className="flex justify-around">
        {content.charAt(0).toUpperCase() + content.slice(1)}
        </div>
       
    </div>
    </Link>
        )
    }
    if(type === 'geopost' || type === 'likegeopost'){
        return(
    <Link href={!commentid ? `/geopost/${link}` : `/geopost/${link}/${commentid}` }>
        <div  className={!viewed ? `shadow-sm highlight mx-0 px-6 py-2 flex cursor-pointer` : 
    `${theme}-menu shadow-sm py-2 mx-0 px-6 flex  cursor-pointer`}
        onMouseOver={() => id && !viewed && hasViewed.mutate({notify_user_id: id})}
    >
        
        {type &&
        <div className="flex items-center p-1">
        {icontable[type]}
        </div>
        }
 
        <div className="flex justify-around">
        {content.charAt(0).toUpperCase() + content.slice(1)}
        </div>
       
    </div>
    </Link>
        )
    }
 if(type === 'comment'){
            return(
    <Link href={!commentid ? `/post/${link}` : `/post/${link}/${commentid}` }>
        <div  className={!viewed ? `shadow-sm highlight mx-0 px-6 py-2 flex cursor-pointer` : 
    `${theme}-menu shadow-sm py-2 mx-0 px-6 flex  cursor-pointer`}
        onMouseOver={() => id && !viewed && hasViewed.mutate({notify_user_id: id})}
    >
        
        {type &&
        <div className="flex items-center p-1">
        {icontable[type]}
        </div>
        }
 
        <div className="flex justify-around">
        {content.charAt(0).toUpperCase() + content.slice(1)} fgfgf
        </div>
       
    </div>
    </Link>
        )

 }
        
  return (
    <div  className={!viewed ? `shadow-sm highlight mx-0 px-6 py-2 flex cursor-pointer` : 
    `${theme}-menu shadow-sm py-2 mx-0 px-6 flex  cursor-pointer`}
        onMouseOver={() => id && !viewed && hasViewed.mutate({notify_user_id: id})}
    >
        
        {type &&
        <div className="flex items-center p-1">
        {icontable[type]}
        </div>
        }
 
        <div className="flex justify-around">
        An error occured on {type}
        </div>
       
    </div>
    
  )
}

export default Item