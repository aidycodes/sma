import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'

type Icon = {
    name: string
    size: number
    isSelected: boolean
    onClick: () => void
}

const Icon = ({name, size, isSelected, onClick}: Icon) => {
    const {theme} = useTheme()
  return (
  <div className={`cursor-pointer ${!isSelected ? theme + '-icon' : theme + '-icon-selected' }`} onClick={onClick}  > 
  <label htmlFor={name}/>
    <Image  src={`/icons/${name}`} alt={name} width={size} height={size} />  
  </div>  
  )
}

export default Icon