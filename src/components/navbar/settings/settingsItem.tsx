import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import ThemePicker from '../../themePicker'

type Props = {
    content: string
    link?: string | undefined | null 
    icon?: string  
    expandable?: boolean
    onClick?: () => void
    onClickOutside?: () => void
}


const SettingsItem = 
({content, link, icon, expandable}
    : Props) => {

    const { theme } = useTheme()
    const [expanded, setExpanded] = useState(false)

  return (
    <div  onMouseOver={() => expandable && setExpanded(true)}
         onMouseLeave={() => expandable && setExpanded(false)}>
    <Link href={`/${link}`}>
    <div  className={ !expanded ?`${theme}-menu shadow-sm py-2 mx-0 px-6 flex  cursor-pointer `
    : `${theme}-menu-selected shadow-sm py-2 mx-0 px-6 flex  cursor-pointer `
        }
       
    >
         {icon &&
        <div className={`flex items-center p-1 absolute left-0 ${theme}-icon`}>
        { <Image alt={icon} src={`/icons/${icon}`} width={20} height={20}/> }
        </div>
        }
        <div className="flex justify-around">
        {content.charAt(0).toUpperCase() + content.slice(1)}
        </div>
    
    </div>
    </Link>
       {
              expandable && expanded &&
        <div>
          <ThemePicker/>
        </div>
       }
       </div>
  )
}

export default SettingsItem