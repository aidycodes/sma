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
    user_post: '📝',
    user_comment: '💬',
    like: '👍',
    follow: '👤',
    user_mention: '📢',
    user_repost: '🔁',
    user_reply: '📩',
}



const Item = ({content, type, link, viewed, id, queryKey}: Props) => {

    const { theme } = useTheme()
     const queryClient = useQueryClient()

    const hasViewed = api.notify.hasViewed.useMutation({
        async onMutate(data) {
            if(queryKey){
              
            const previousTodo = queryClient.getQueryData([...queryKey]) as Note  
            const updatedTodos = previousTodo?.pages.map((page, i) => {
            const notes = page.notifcations.map((note) => (
                note.nofiy_user_id === data.notify_user_id ? {...note, viewed: true} : note
                ))        
                return {notifcations:notes, nextCursor: previousTodo.pages[i].nextCursor}
            })
   
         
                queryClient.setQueryData([...queryKey], {pages:updatedTodos, pageParams:previousTodo.pageParams})
                return {pages:updatedTodos, pageParams:previousTodo.pageParams}
        }
    },
        onError(err, newTodo, context) {
            if(queryKey && context){
            queryClient.setQueryData([...queryKey], {pages:context.pages, pageParams:context.pageParams})
            }
        },
        onSuccess(data) {
            if(queryKey && data){
            queryClient.invalidateQueries({queryKey:[...queryKey, data.notify]})
            }
        }
    })
        
  return (
    <Link href={`/${type}/${link}`}>
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

export default Item