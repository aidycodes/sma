import { useAtom } from 'jotai'
import Image from 'next/image'
import React from 'react'
import { FeedDirectorAtom } from '~/jotai/store'

const FeedButton = ({setFeed, feed, type}: 
     {setFeed: React.Dispatch<React.SetStateAction<string>>, feed: string, type: string}) => {

      const [sss, setValue] = useAtom(FeedDirectorAtom)

  return (
            <div className={`flex flex-col items-center justify-center  bg rounded-xl w-[20%] h-[100px] cursor-pointer p-4 hover:brightness-125 shadow-xl  transition-all
        ${feed === type && 'brightness-125 shadow-none'}`}
           onClick={() => {
            setFeed(type)
            setValue(type)
            }} >
            <Image src={`/icons/feed/${type}.svg`} width={40} height={40} alt={type} className="mb-auto"/>
            <button className={`text-center text-lg lg:text-xl text-gray-500  mb-auto ${feed === type && 'text-gray-400'}`}>{type.charAt(0).toLocaleUpperCase() + type.slice(1) }</button>
        </div>
  )
}

export default FeedButton