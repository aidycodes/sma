import React from 'react'
import { createPortal } from 'react-dom';

const Modal = ({ component }: {component: React.ReactNode}) => {
  const [documentMouned, setDocumentMounted] = React.useState(false);

    React.useEffect(() => {
   setDocumentMounted(true)
  }, []);
if(!documentMouned) return null
  return (
    <>
    { createPortal(<div className=" w-full h-full shadow-xl absolute top-0 fadeIn  bg-[rgba(189,195,199,0.6)] mt-20">{component}</div>, 
    document.body)}
    </>
  )
 
}

export default Modal