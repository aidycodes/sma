import { useTheme } from 'next-themes';
import React from 'react'
import Tabs from '~/components/tabs';
const tabButtons = require('./tab-buttons.json')
const Page = () => {

    const [activeTab, setActiveTab] = React.useState(1);
    const { theme } = useTheme()

  return (
<>
    <div className='w-full max-w-lg px-10 py-8 mx-auto fg rounded-lg shadow-xl flex'>

  

        <div className='max-w-md mx-auto space-y-6'>
            <div className='text-xl text-center '>
                <p className='font-medium '>Edit Profile</p>
            </div>       
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
             
                <div className="flex flex-col">
              
                <div className="relative flex flex-row  items-center">
                   <div className={`${theme === 'light' && theme }-icon ${theme === 'neon' && theme }-icon
                    ${activeTab === 1 && theme}-icon`}>
                        <button  onClick={() => setActiveTab(1)}
                        className={`w-1/3 md:w-[120px] h-16 px-4 flex flex-col items-center gap-1  py-2    `}>
                            <span className={`material-symbols-outlined`}>person</span>
                            <p className="text-sm ">Details</p>
                        </button>
                   </div>
                   <div className={`${theme === 'light' && theme }-icon ${theme === 'neon' && theme }-icon`}>
                        <button onClick={() => setActiveTab(2)} 
                        className={`w-1/3 md:w-[120px] h-16 px-4 flex flex-col items-center gap-1  py-2 ${activeTab === 2 && theme}-icon `}>
                            <span className="material-symbols-outlined">image</span>
                            <p className="text-sm">Images</p>
                        </button>
                    </div>
                    <div className={`${theme === 'light' && theme }-icon ${theme === 'neon' && theme }-icon`}>
                        <button onClick={() => setActiveTab(3)}
                        className={`w-1/3 md:w-[120px] h-16 px-4 flex flex-col items-center gap-1  py-2 ${activeTab === 3 && theme}-icon`}>
                            <span className="material-symbols-outlined z-0">landscape</span>
                            <p className="text-sm ">Location</p>
                        </button>
                    </div>                 
                    <div role="indicator" className={`absolute ${activeTab === 1 ? 'tabLeft' : activeTab === 2 ? 'tabMiddle' : 'tabRight' }  bottom-0 transition-all duration-200 ease-in-out bg-purple-600  w-1/3 md:w-[120px] h-0.5 rounded-t-full`}></div>
               
                </div>
                
              
                <div className="flex flex-col">
                    {activeTab === 1 && 
                    <div  className="active [&amp;.active]:block  py-4 transition duration-400 ease-in-out">
                    <h3>Tabs content 1</h3>
                    
                    </div>
}
                  {activeTab === 2 && 
                    <div  className="active [&amp;.active]:block  py-4 transition duration-400 ease-in-out">
                    <h3>Tabs content 2</h3>
                    
                    </div>
}
                  {activeTab === 3 && 
                    <div className="active [&amp;.active]:block  py-4 transition duration-400 ease-in-out">
                    <h3>Tabs content 3</h3>
                    
                    </div>
}
                    
                </div>
                </div>
                </div>
                
            </div>
          
      
 </>   

  )
}

export default Page

//left-${activeTab === 1 ? 0 : activeTab === 2 ? 32 : 52}