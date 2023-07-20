import React from 'react'
import User from './user';
import ImageUpload from './imageupload';
import Mood from './mood';
import { useForm } from 'react-hook-form';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { Josefin_Sans  } from 'next/font/google';
import Image from 'next/image';
import Palette from './palette';
import { useSubmitPostFollowers, useSubmitPostGeo } from '~/hooks/api/useSubmitPost';
import { useAtom } from 'jotai';
import { currentLocationAtom, whereToPostAtom } from '~/jotai/store';

const jose = Josefin_Sans({ subsets: ['latin'], weight:'300' });

const CreatePostPopup = ({ setPopup, options }:
     { setPopup: React.Dispatch<React.SetStateAction<boolean>>
    , options:boolean }) => {

    const ref = React.useRef(null)
    useOutsideClick(ref, () => setPopup(false))
    const [showOptions, setshowOptions] = React.useState(options)

    const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
        content: '',
        color:'',
        mood: '',
        title:'',
        background:'',
        image:'',
    }
     })

     const followerSubmit = useSubmitPostFollowers()
     const geoSubmit = useSubmitPostGeo()
     const [ whereToPost ] = useAtom(whereToPostAtom)
     const [ currentLocation ] = useAtom(currentLocationAtom)

     const onSubmit = (data: any) => {
            const meta = {
                background:data.background,
                color:data.color,
                image:data.image}
        if(whereToPost === 'Followers'){


        followerSubmit.mutate({content:data.content,
                        title:data.title,
                        meta
        })
        } else {
            geoSubmit.mutate({title:data.title,
                            content:data.content,
                            type:'geo',
                            lat:currentLocation?.lat,
                            lng:currentLocation?.lng,
                            meta
            })
        }
        setPopup(false)
     }
     
  const watchAllFields = watch();

  return (
    
   <div ref={ref} className=" w-full items-center mx-auto"> 
    
<div  className="absolute left-0 right-0 max-w-[800px] z-40 mx-auto mt-32   p-4 overflow-y-auto inset-0 h-full ">
    <div className="relative w-full max-h-full lg:shadow-2xl">
        <div className="relative fg rounded-lg shadow dark:bg-gray-700 dbo-border">
            <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:brightness-125 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal" onClick={() => setPopup(false)}>
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center">
        {/* user component */}
            <User/>
                <div>
        {/* post component */}
                <textarea className={`w-full rounded-xl h-40 pl-2 pt-2 mt-4 ${watchAllFields.color + 'ColorOnly'} ${watchAllFields.background}
                text-2xl font-semibold placeholder:${watchAllFields.color} `}
                 placeholder='Shout anything!' {...register('content')}/>
                </div>
            <div>
                  <div className={`flex transition-all items-center cursor-pointer ${showOptions ? 'rotate-360' : 'rotate-1' } `}>
        <Image src={'/icons/spin.svg'} width={24} height={24} alt="image"  onClick={() => setshowOptions(!showOptions)} 
        className={` transition-all duration-500 ${!showOptions ? 'rotate-[0deg]' : 'rotate-[1360deg]' }`}/>
        <h2 className={`mr-auto px-1 mt-1  ${jose.className} `}  onClick={() => setshowOptions(!showOptions)} 
        >{!showOptions ? 'Options' : 'Hide'}</h2>
        <Palette selectedColor={watchAllFields.color} setValue={setValue}/>
        </div> 
            <Mood showOptions={showOptions} watch={watch} setValue={setValue}/>
      
            </div> 
               <hr className=" border-slate-600 w-full mt-4 "/>            
            <div className="mt-8">
  
             <ImageUpload setValue={setValue} isDisabled={watchAllFields.background ? true : false}/>
            </div>
        {/* submit  */}
                <button  type="button" className="text-white w-full mt-4  bg-blue-700
                 hover:bg-blue-600 focus:ring-4 focus:outline-none outline-[1px] focus:ring-blue-300 dark:focus:ring-blue-800 
                 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2" onClick={handleSubmit(onSubmit)}>
                    Post
                </button>

            </div>
        </div>
    </div>
</div>

</div>
  )
}

export default CreatePostPopup