import Image from 'next/image'
import React from 'react'

const Avatar = ({url, width, height}: 
    {url?:string | null, width: number, 'height': number}) =>  (
       <div className={`w-[${40}px] h-[${40}px] rounded-[50px] relative`}>
        <div className="w-20 h-20">
                        <Image className="rounded-[50px]" fill 
                            src={url ?  url : '/icons/user.svg'} 
                            alt="avatar"  />
        </div>
    </div>
  )

export default Avatar