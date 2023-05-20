import React from 'react'

const LoadingSpinner = 
({size = 'med'}: {size?: string}) => {
  return (
   <span className={`${size === 'small' ? 'loader-small' : 'loader'} `}></span>
  )
}

export default LoadingSpinner