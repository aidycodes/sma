import React from 'react'

const AdditionalOptions = () => {
    const [ownPostsOnly, setOwnPostsOnly] = React.useState(false)
  return (

    <div className="flex justify-between">

        <div className="flex gap-2 opacity-80 cursor-pointer" onClick={() => setOwnPostsOnly(!ownPostsOnly)}>
        <input checked={ownPostsOnly} type="checkbox"/>
        <div>Own Posts Only</div>
        </div>
        <div>
        
            <input className="rounded-xl pl-2" type="text" placeholder="Location search"/>
        </div>
    </div>

  )
}

export default AdditionalOptions