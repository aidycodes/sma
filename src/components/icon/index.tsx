import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'

type Icon = {
    name: string
    size: number
    isSelected: boolean
    onClick: () => void
    text?: string
}

const Icon = ({name, size, isSelected, onClick, text}: Icon) => {
    const {theme} = useTheme()
  return (
  <div className={`flex cursor-pointer ${!isSelected ? theme + '-icon' : theme + '-icon-selected' }`} onClick={onClick}  > 
  <label htmlFor={name}/>
    <Image  src={`/icons/${name}`} alt={name} width={size} height={size} />
    {text && <span className="ml-2">{text}</span>}  
  </div>  
  )
}

export default Icon