import { Prisma } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// const testObject = {
//     title: '',
//     link: 'www.test.com',
//     image:'https://uploadthing.com/f/7e5da76d-af53-44f0-815b-a2c985957e4d_IMG_20170321_173211102.jpg'
// }
const testObject = {
    link:'',
    title:'',
    image:''
}
const Content = ({ meta, content }: { meta: Prisma.JsonValue, content: string}) => {

    if(testObject.link){
  return (
        <Link href={testObject?.link.startsWith('http') ? testObject?.link : `http://${testObject.link}`} >
        <div className=" w-full border-gray-600 border-[1px] rounded-xl">
            <div className="flex flex-col justify-center ">
        
        {testObject?.image && <Image alt="image" height={200} width={900} src={testObject?.image}/>}
        {testObject?.title && <div className="text-xl self-center pl-8 pt-2 pb-2 font-bold">{testObject?.title}</div>}
        </div>
        </div>
        <div className="p-2 mt-8">{content}</div>
        </Link>
  )
    }
    if(testObject.image){
    return (
        <>
        <div className=" w-full border-gray-600 border-[1px] rounded-xl">
            <div className="flex flex-col justify-center ">
        
        {testObject?.image && <Image alt="image" height={200} width={900} src={testObject?.image}/>}
        {testObject?.title && <div className="text-xl self-center pl-8 pt-2 pb-2 font-bold">{testObject?.title}</div>}
        </div>
        </div>
        <div className="p-2 mt-8">{content}</div>
        </>
    )
    }
    return (
        <div>
        {content}
        </div>
    )
}

export default Content