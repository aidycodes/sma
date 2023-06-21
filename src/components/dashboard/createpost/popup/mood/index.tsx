import React from 'react'
import { Josefin_Sans  } from 'next/font/google';
import Image from 'next/image';
import { UseFormWatch } from 'react-hook-form';

const jose = Josefin_Sans({ subsets: ['latin'], weight:'300' });

type MoodProps = {
    showOptions: boolean
    watch: UseFormWatch<{
    content: string;
    mood: string;
    title: string;
    background: string;
    image: boolean;
    meta: string;
}> 
    setValue: any
}

const Mood = (
    { showOptions, watch, setValue }: MoodProps) => {

    //const [showOptions, setShowOptions] = React.useState(false)
        const currentMood = watch('mood')
        const currentBackground = watch('background')
        const currentImage = watch('image')
        console.log(currentBackground)

    const setMood = (mood: string) => {
        if(currentMood !== mood){
            setValue("mood", mood)
            setValue("title", "is feeling happy")
    } else{
        setValue("mood", "")
        setValue("title", "")
        }
    }
    
    const setBackground = (background: string) => {
        if(currentImage) return
        if(currentBackground !== background){
            setValue("background", background)
            setValue("meta", {background: background})
    } else{
        setValue("background", "")
        setValue("meta", "JsonNull")
        }
    }

  return (
    <div className={`flex flex-col  px-8 justify-start transition-all overflow-hidden duration-300 ease-in-out rounded-xl
    ${!showOptions ? 'h-[0px]' : 'h-44'}`}  >

           
        <div className="flex flex-wrap justify-around md:justify-center   ">
            <div className={`flex items-center hover:backdrop-brightness-200 rounded-md pt-1 px-2 cursor-pointer
             ${currentMood === 'happy' && 'backdrop-brightness-200'}`} onClick={() => setMood("happy")}>
                <Image src="/icons/smile-beam.svg" width={24} height={24} alt="image" />
                <h2 className={`mr-auto px-4 py-1 ${jose.className} `}>Happy</h2>
                </div>
                
                <div className={`flex items-center hover:backdrop-brightness-200 rounded-md pt-1 px-2 cursor-pointer
             ${currentMood === 'sad' && 'backdrop-brightness-200'}`} onClick={() => setMood("sad")}>
                <Image src="/icons/smile-beam.svg" width={24} height={24} alt="image" />
                <h2 className={`mr-auto px-4 py-1 ${jose.className} `}>Sad</h2>
                </div>
                <div className={`flex items-center hover:backdrop-brightness-200 rounded-md pt-1 px-2 cursor-pointer
             ${currentMood === 'excitied' && 'backdrop-brightness-200'}`} onClick={() => setMood("excitied")}>
                <Image src="/icons/smile-beam.svg" width={24} height={24} alt="image" />
                <h2 className={`mr-auto px-4 py-1 ${jose.className} `}>Excitied</h2>
                </div> 
                <div className={`flex items-center hover:backdrop-brightness-200 rounded-md pt-1 px-2 cursor-pointer
             ${currentMood === 'frustrated' && 'backdrop-brightness-200'}`} onClick={() => setMood("frustrated")}>
                <Image src="/icons/smile-beam.svg" width={24} height={24} alt="image" />
                <h2 className={`mr-auto px-4 py-1 ${jose.className} `}>Frustrated</h2>
                </div>
                <div className={`flex items-center hover:backdrop-brightness-200 rounded-md pt-1 px-2 cursor-pointer
             ${currentMood === 'content' && 'backdrop-brightness-200'}`} onClick={() => setMood("content")}>
                <Image src="/icons/smile-beam.svg" width={24} height={24} alt="image" />
                <h2 className={`mr-auto px-4 py-1 ${jose.className} `}>Content</h2>
                </div>
            <hr className="w-full border-slate-600 mt-1"/>
            
        </div>

<div className="text-left ">
    <div className={`pb-2 ${currentImage && 'hover:border-none cursor-default'}`} >
                
    </div>
                <div className={`flex  justify-around pt-2 ${currentImage && 'blur-md cursor-default'}`}>
        <div className={`swirls-small h-24 w-24 scale-1 hover:border-2 cursor-pointer ${currentImage && 'hover:border-none cursor-auto'}
         ${currentBackground === 'swirls' && 'border-2 border-blue-300' }`} onClick={() => setBackground('swirls')}/>
         <div  className={`xmas h-24 w-24 scale-1 hover:border-2 cursor-pointer ${currentImage && 'hover:border-none cursor-auto'}
         ${currentBackground === 'xmas' && 'border-2 border-blue-300' }`} onClick={() => setBackground('xmas')}></div>
          <div  className={`waves h-24 w-24 scale-1 hover:border-2 cursor-pointer ${currentImage && 'hover:border-none cursor-auto'}
         ${currentBackground === 'waves' && 'border-2 border-blue-300' }`} onClick={() => setBackground('waves')}/>
           <div  className={`temani h-24 w-24 scale-1 hover:border-2 cursor-pointercursor-pointer ${currentImage && 'hover:border-none cursor-auto'}
         ${currentBackground === 'temani' && 'border-2 border-blue-300' }`} onClick={() => setBackground('temani')}/>        
                
       
                </div>
               
            </div>{currentImage &&
             <div className=" text-xs mt-[8px] opacity-70" >Backgrounds cannot be used with images</div>
            }
    </div>
  )
}

export default Mood