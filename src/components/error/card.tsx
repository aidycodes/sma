import { useTheme } from 'next-themes'
import React from 'react'

const Card = ({ children }
    :{children: React.ReactNode}) => {
    const { theme } = useTheme()
  return (
    <div className={`fg p-8 rounded-md shadow-md mt-12 flex flex-col ${theme === 'dark-blue' || theme === 'dark-blueFix' && 'items-center'} flex  justify-center `}>
        
        {children}
    </div>
  )
}

export default Card