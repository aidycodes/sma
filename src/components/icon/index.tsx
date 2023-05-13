import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'

type Icon = {
    name: string
    size: number
    color: string
    onClick: () => void
    onHover?: () => void
    className?: string
}

const Icon = ({name, size, color, className, onClick, onHover}: Icon) => {
    const {theme} = useTheme()
  return (
  <div className={`cursor-pointer ${theme}-icon`} onClick={onClick} > 
  <label htmlFor={name}/>
    <Image  src={`/icons/${name}`} alt={name} width={size} height={size} />  
  </div>  
  )
}

export default Icon