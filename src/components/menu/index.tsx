import React, { useRef } from 'react'
import { useOutsideClick } from '~/hooks/useOutsideClick'
import Icon from '../icon'
import Popup from './popup'
import Notify from '../navbar/notify'

type Props = {
    icon: string
    size: number
    component: React.ReactNode
    width?: number
    text?: string
    forPost?: boolean
}

const Menu = ({icon, size, component, width, text, forPost = false}: Props) => {

    const [showPopup, setShowPopup] = React.useState(false)

    const ref = useRef(null)      
    useOutsideClick(ref, () => setShowPopup(false))

    if(forPost) return (
      <div ref={ref} className="relative flex cursor-pointer items-center" onClick={() => setShowPopup(!showPopup)}>
      {text && <div className="pl-2 text-xs">{text}</div>}
    <Icon size={size}  name={icon} onClick={() => setShowPopup(!showPopup)} isSelected={showPopup} />
    {showPopup && <Popup component={component} width={width}/>}
    </div>
  )

  return (
        <div ref={ref} className="relative">
      {text && text}
    <Icon size={size}  name={icon} onClick={() => setShowPopup(!showPopup)} isSelected={showPopup} />
    {showPopup && <Popup component={component} width={width}/>}
    </div>
  )
}

export default Menu



    