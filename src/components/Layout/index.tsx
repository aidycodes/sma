import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="flex justify-center flex-col items-center relative z-0 mt-40">
    {children}
    </div>
  )
}

export default Layout