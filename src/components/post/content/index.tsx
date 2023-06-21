import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Meta = {
    color?: string
    background?: string
    image?: string
    link?: string
}
const testObject = {
    link:'',
    title:'',
    image:''
}
const Content = ({ meta, content }: { meta: Meta, content: string}) => {

    if(testObject.link){
  return (
        <Link href={testObject?.link.startsWith('http') ? testObject?.link : `http://${testObject.link}`} >
        <div className=" w-full border-gray-600 border-[1px] rounded-xl">
            <div className="flex flex-col justify-center ">
        
        {testObject?.image && <Image alt="image" height={200} width={900} src={testObject?.image}/>}
        {testObject?.title && <div className="text-xl self-center pl-8 pt-2 pb-2 font-bold">{testObject?.title}</div>}
        </div>
        </div>
        <div className={`p-2 mt-8 ${meta?.color && meta?.color}`}>{content}</div>
        </Link>
  )
    }
    if(meta.image){
    return (
        <>
        <div className=" w-full border-gray-600 border-[1px] rounded-xl">
            <div className="flex flex-col justify-center ">
        
        {meta?.image && <Image alt="image" height={200} width={900} src={meta?.image}/>}
        </div>
        </div>
        <div className={`p-2 mt-8 text-xl ${meta?.color && meta?.color + 'ColorOnly'}`}>{content}</div>
        </>
    )
    }
    if(meta.background){
            return (
        <div className={`${meta.background} ${meta?.color && meta?.color + 'ColorOnly'} min-h-[300px] flex justify-center`}>
       <div className="text-3xl text-center font-extrabold my-auto p-2"> {content} </div> 
        </div>
    )
    }
    return (
        <div className={`${meta?.color && meta?.color + 'ColorOnly'} text-xl `}>
        {content}
        </div> 
    )
}

export default Content