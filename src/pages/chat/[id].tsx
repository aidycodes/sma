import React from 'react'
import Chat from '~/components/chat/chatbox'
import ContactList from '~/components/chat/contactList'
import NewChatModal from '~/components/chat/newchat/NewChatModel'

export type SetCreateMessage = React.Dispatch<React.SetStateAction<boolean>>

const ChatPage = () => {

    const [createMessage, setCreateMessage] = React.useState(false)

  return (
    <div className="mt-20  w-full h-[calc(100vh-80px)]  mx-auto overflow-y-hidden">
        <div className="h-screen flex">
        <ContactList setCreateMessage={setCreateMessage} createMessage={createMessage} />
        <Chat/>
        </div>
        {createMessage && <NewChatModal setCreateMessage={setCreateMessage} />}
    </div>
  )
}

export default ChatPage