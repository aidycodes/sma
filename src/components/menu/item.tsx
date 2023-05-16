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
    notifcations: NotifyUser[]
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
                console.log(queryKey)
            const previousTodo = queryClient.getQueryData([...queryKey]) as Note
            console.log({previousTodo})
            const updatedTodos = previousTodo?.notifcations.map((note) => (
                note.nofiy_user_id === data.notify_user_id ? {...note, viewed: true} : note
            ))
          
                queryClient.setQueryData([...queryKey], {notifcations:updatedTodos})
                return {notifcations:previousTodo.notifcations}
        }
    },
        onError(err, newTodo, context) {
            if(queryKey && context){
            queryClient.setQueryData([...queryKey], {notifcations:context.notifcations})
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