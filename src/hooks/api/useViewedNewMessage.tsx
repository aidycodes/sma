import { ChatMessage } from '@prisma/client'
import { api } from '~/utils/api'

const useViewedNewMessage = (lastMessageId: string, chatid: string) => {
    const trpc = api.useContext()
    return  api.chat.hasViewedMessage.useMutation({
        onMutate: () => {
            trpc.chat.getChatList.cancel()
            trpc.chat.getChatList.setInfiniteData({}, (oldData) => {
                const newPages = oldData?.pages.map((page) => {
                    return {chatList:{chats:page?.chatList?.chats?.map((chat) => {
                        if (chat.chatid === chatid) {
                            return {
                                ...chat,
                                messages: [
    ...chat.messages.map((message: ChatMessage) => message.messageid === lastMessageId ? { ...message, viewed: true } : message)
                                ]
                            }
                        }
                        return chat
                    })
                    }}
                })
  
                return {...oldData, pages: newPages}
            })
        },
        onSuccess: () => {
            trpc.chat.getChatList.invalidate()
        }
    })

}

export default useViewedNewMessage