import Image from 'next/image'
import React from 'react'

type Props = {
    image?: string | null

}


const Banner = ({ image }: Props) => (
    <>
    {image ? 
    <div className="relative w-full  h-[380px] md:h-[400px]  xl:h-[540px] ">
        <Image className="object-cover"  src={image} fill   alt="banner" />
    </div>
    :
    <div className="w-full h-[100px] bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... opacity-70"/>
    }
    </>
  )


export default Banner