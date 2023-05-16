import React from 'react'

const Page = () => {

    const [activeTab, setActiveTab] = React.useState(1);

  return (
<>
    <div className='w-full max-w-lg px-10 py-8 mx-auto fg rounded-lg shadow-xl flex'>
        <div className='max-w-md mx-auto space-y-6'>
            <div className='text-xl text-center leading-7'>
                <p className='font-medium text-gray-700'>Edit Profile</p>
            </div>       
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
             
                <div className="tabs flex flex-col w-full md:w-[360px]">
              
                <div className="relative flex flex-row  items-center">
                    <button onClick={() => setActiveTab(1)}
                    className="active w-1/3 md:w-[120px] h-16 px-4 flex flex-col justify-end items-center gap-1  py-2 hover:bg-surface-100 dark:hover:bg-surfacedark-100">
                    <span className="material-symbols-outlined">person</span>
                    <p className="text-sm tracking-[.00714em]">Details</p>
                    </button>
                    <button onClick={() => setActiveTab(2)} 
                    className="w-1/3 md:w-[120px] h-16 px-4 flex flex-col justify-end items-center gap-1  py-2 hover:bg-surface-100 dark:hover:bg-surfacedark-100">
                    <span className="material-symbols-outlined">image</span>
                    <p className="text-sm tracking-[.00714em]">Images</p>
                    </button>
                    <button onClick={() => setActiveTab(3)}
                     className=" w-1/3 md:w-[120px] h-16 px-4 flex flex-col justify-end items-center gap-1 relative py-2 hover:bg-surface-100 dark:hover:bg-surfacedark-100">
                    <span className="material-symbols-outlined">landscape</span>
                    <p className="text-sm tracking-[.00714em]">Location</p>
                    </button>
                 
                    <div role="indicator" className={`absolute ${activeTab === 1 ? 'tabLeft' : activeTab === 2 ? 'tabMiddle' : 'tabRight' }  bottom-0 transition-all duration-200 ease-in-out bg-purple-600 dark:bg-purple-200 w-1/3 md:w-[120px] h-0.5 rounded-t-full`}></div>
               
                </div>
                
               <hr className="border-gray-200 border-2 dark:border-gray-700"/>
                <div className="flex flex-col">
                    {activeTab === 1 && 
                    <div id="tab-4" role="tabpanel" className="active [&amp;.active]:block  py-4 transition duration-400 ease-in-out">
                    <h3>Tabs content 1</h3>
                    
                    </div>
}
                  {activeTab === 2 && 
                    <div id="tab-4" role="tabpanel" className="active [&amp;.active]:block  py-4 transition duration-400 ease-in-out">
                    <h3>Tabs content 2</h3>
                    
                    </div>
}
                  {activeTab === 3 && 
                    <div id="tab-4" role="tabpanel" className="active [&amp;.active]:block  py-4 transition duration-400 ease-in-out">
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