import Image from 'next/image'
import React from 'react'

const Avatar = ({ image }: { image: string}) => {
    
      return (
    <div className="h-[50px] w-[50px] relative">
         <Image src={image ? image : '/icons/user.svg'} fill alt="avatar2"  className="rounded-[50px]"  />
     </div>
      )
}

const MultiAvatar = ({images}: {images: string[]}) => {
    console.log({images})
    if(!images) return null
    const images2 = [...images, ...images, ...images, ...images, ...images ]
    console.log({images2})
    const avatars = images.map((image,i) => {
        if(i < 4) return (
        <div className={`absolute ${i === 0 ? 'left-0' : i === 1 ? 'left-5' : i === 2 ? 'left-10' : i === 3 ?  'left-16' : 'left-20' } `}>
            <Avatar image={image} />
        </div>
        )
        if(i === 4) return (
        <div className="absolute left-20">
            <div className="h-[50px] w-[50px] relative bg-blue-900 rounded-[50px] flex justify-center items-center text-xl"><div>+{images2.length-4}</div></div>
        </div>
        )
})
console.log(images2.length)
        const width = images.length < 4 ? 50 : images.length === 4 ? 60 : images.length === 5 &&  100
    
  return (
    <div className={`relative ${`w-[${width}px]`} h-[50px]`}>{avatars}</div>
  )
}

export default MultiAvatar