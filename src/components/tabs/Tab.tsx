import { useTheme } from 'next-themes'
import React from 'react'
import { TabButton } from '.'
import Icon from '../icon'

const TabIcons = ({ name, icon, isSelected, onClick }: TabButton) => {

    const { theme } = useTheme()


  return (
    <div className="relative flex flex-row  items-center -z-0">
                   <div className={`${theme === 'light' || theme === 'lightFix' && theme }-icon ${theme === 'neon' || theme === 'neonFix' && theme }-icon  ${theme === 'dark' || theme === 'darkFix' && 'dark-text'}
                    ${isSelected  && theme}-icon-selected `}>
                        <button  onClick={() => onClick(1)}
                        className={`w-[120px] h-16 px-4 flex flex-col items-center gap-1  py-2    `}>
                            <Icon name={icon} size={30} isSelected={isSelected} onClick={() => {}} />
                            <p className={`text-sm  `}>{name}</p>
                        </button>
                    </div>
    </div>
                          )
}

export default TabIcons