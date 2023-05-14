import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { api } from '~/utils/api'


type Props = {
    content: string
    type?: string | undefined | null
    link?: string | undefined | null
    viewed?: boolean
    icon?: string
    id?: string
    expanded?: boolean
    onClick?: () => void
    onClickOutside?: () => void
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

const Item = ({content, type, onClick, link, viewed, icon, id, expanded}: Props) => {

    const { theme } = useTheme()
    const hasViewed = api.notify.hasViewed.useMutation()

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
         {icon &&
        <div className={`flex items-center p-1 absolute left-0 ${theme}-icon`}>
        { <Image alt={icon} src={`/icons/${icon}`} width={20} height={20}/> }
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