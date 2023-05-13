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
    id?: string
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

const Item = ({content, type, onClick, link, viewed, id}: Props) => {

    const { theme } = useTheme()
    const hasViewed = api.notify.hasViewed.useMutation()

  return (
    <Link href={`/${type}/${link}`}>
    <div  className={!viewed ? ` highlight mx-0 px-6 flex cursor-pointer` : `${theme}-menu mx-0 px-6 flex  cursor-pointer`}
        onMouseOver={() => id && hasViewed.mutate({notify_user_id: id})}
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