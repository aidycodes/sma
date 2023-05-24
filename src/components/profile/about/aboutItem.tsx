import Image from 'next/image'
import React from 'react'

type Props = {
    text: string
    icon: string
}

const AboutItem = ({ text, icon }: Props) => (
    
    <div className="py-1 my-2 px-4 flex gap-3 items-center ">
        <Image src={`/icons/profile/${icon}`} width={30} height={30} alt="icon"/>
            <h3 className="text-xl">{text}</h3>
    </div>
  )


export default AboutItem