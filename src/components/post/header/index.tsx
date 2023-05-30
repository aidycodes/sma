import React, { useState } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import UserToolTip from '~/components/userToolTip'
dayjs.extend(relativeTime)

type Props = {
    avatar?: string | null
    created_at?: Date
    username?: string
    userid?: string
}

const PostHeader = ({ avatar, created_at, username, userid}: Props) => {

    const [showToolTip, setShowToolTip] = useState(false)
    
    if(!userid) return null
     

  return (
            <Link href={`/user/${userid}`}>
                <div className="flex items-center gap-2 relative"
                     onMouseOver={() => setShowToolTip(true)} onMouseLeave={() => setShowToolTip(false)}>
                    <div className="w-14 h-14 rounded-[50px] relative">
                        <Image className="rounded-[50px]" fill 
                            src={avatar ?  avatar : '/icons/user.svg'} 
                            alt="avatar"  />
                    </div>
                        <div className="flex  flex-col">
                            <h2 className="text-xl">{username}</h2>   
                            <h4 className="text-sm">{dayjs(created_at).fromNow()}</h4>
                        </div>
                        
                          {showToolTip && <UserToolTip username={username} avatar={avatar} userid={userid} />}       
                </div>

            </Link>
          
       
  )
}

export default PostHeader