import Image from 'next/image'
import React from 'react'
import Color from './color'

const paletteColors = [
    'blue',
    'red',
    'green',
    'yellow',
    'purple',
    'pink',
    'orange',
    'black',
    'white',

]


const Palette = ({ selectedColor, setValue}:
     {selectedColor: string, setValue: any}) => {
  return (
    <div className="flex gap-1 items-center">
        <Image src="/icons/profile/bio.svg" width={21} height={21} alt="image" />
    {paletteColors.map((color: string) => (
        <Color key={color} color={color} selected={color === selectedColor} setValue={setValue}/>
    ))}

    </div>
    
  )
}

export default Palette