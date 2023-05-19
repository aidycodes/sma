import React from 'react'

type Props = {
    type: string | undefined
    value: string | number
}

const LocationItem = ({type, value}: Props) => {
  return (
     <div className="flex ">
          
            <p className="rounded-md  outline-none" >{value}</p>
    </div>
  )
}

export default LocationItem