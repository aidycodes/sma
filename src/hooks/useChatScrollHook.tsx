import React from 'react'

const useChatScrollHook = () => {
  const infinteRef = React.useRef<HTMLDivElement>(null)
  const handleScroll = () => {
    infinteRef.current?.scrollIntoView({ behavior: 'auto', block: 'end',  inline: 'start' })
  }
  return { infinteRef, handleScroll }
}

export default useChatScrollHook