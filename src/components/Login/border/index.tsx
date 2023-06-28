import React from 'react'

const BorderLine = () => {
  return (
    <div className="flex flex-1 absolute top-[-90px] right-0">
  <p className="pr-6"></p>
  <div
    className="h-[250px] min-h-[1em]  self-stretch bg-gradient-to-tr -rotate-45 overflow-hidden w-[10px] from-transparent via-blue-200 to-transparent opacity-20 dark:opacity-100"></div>
  <p className="pl-6"></p>
</div>
  )
}

export default BorderLine