import React from 'react'

const Swash = ({ theme }:
    {theme: string}) => {
  return (
    <div className="border-white border-2 flex max-w-fit ">
        <div className={`h-14 w-5 theme-picker-bg-${theme}`}></div>
        <div className={`h-14 w-5 theme-picker-fg-${theme}`}></div>
        <div className={`h-14 w-5 theme-picker-text1-${theme}`}></div>
        <div className={`h-14 w-5 theme-picker-text2-${theme}`}></div>

    </div>
  )
}

export default Swash