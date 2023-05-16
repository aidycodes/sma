import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="flex justify-center flex-col items-center">
    {children}
    </div>
  )
}

export default Layout