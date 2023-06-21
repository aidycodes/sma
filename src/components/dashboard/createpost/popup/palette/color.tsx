import React from 'react'

const Color = ( { selected = false, color, setValue}:
     {selected: boolean, color: string, setValue: any}) => {
  return (
    <div className={`h-5 w-5 ${color + 'Palette'} rounded-[50px] 
     transition-all hover:scale-125 cursor-pointer ${selected && `scale-110 border-2` }`}
     onClick={() => setValue("color", color)}
     ></div>
  )
}

export default Color