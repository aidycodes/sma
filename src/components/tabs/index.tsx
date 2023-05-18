import { useTheme } from 'next-themes'
import React from 'react'
import TabIcons from './Tab'
import Tab from './Tab'


export type TabButton = {
    name: string
    icon: string
    isSelected: boolean
    onClick: (tabNumber: number) => void
}

type Props = {
    children: React.ReactNode[]
    tabs?: TabButton[]
}


const Tabs = ({tabs, children}: Props) => {

    const {theme} = useTheme()

    const [activeTab, setActiveTab] = React.useState(1)

    const displayNodes = children?.filter((child, index) => activeTab-1 === index)

    const tabButtons = tabs?.map((tab, index) => 
    <TabIcons key={index} name={tab.name} icon={tab.icon} onClick={() => setActiveTab(index+1)} isSelected={activeTab-1 === index} />)

  return (
   
       <div className="w-[380px]">           
            <div className="relative flex flex-row justify-center  items-center  -z-0">
               {tabButtons}
               <div role="indicator" className={`absolute ${activeTab === 1 ? 'tabLeft' : activeTab === 2 ? 'tabMiddle' : 'tabRight' }  bottom-0 transition-all duration-200 ease-in-out bg-purple-600 w-1/${tabButtons?.length} md:w-[120px]  h-0.5 rounded-t-full`}></div>
        
         </div>
          <hr className={`${theme === 'dark' ? 'border-black' : theme === 'dark-blue' ? 'border-blue-400' : 'border-gray-200'} border-2 `}/>
                    {displayNodes}
    </div>
  )
}

export default Tabs