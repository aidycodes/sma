import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const chatRouter = createTRPCRouter({
    createChat: privateProcedure
            .input(z.object({users: z.array(z.string()) }))
            .mutation( async({ input, ctx }) => {
                try{
                      const { users } = input;
                    if(users.length < 2){          
                    const chatExist = await ctx.prisma.chat.findFirst({
                        where: {
                            chatmembers: {
                                every: {
                                    id: {
                                        in: [...users, ctx.currentUser.session.userId]
                                    }
                                }
                            }
                        }
                    })
                        if(chatExist){
                            return {
                                chat: chatExist
                            }
                        }
                    }
                    const chat = await ctx.prisma.chat.create({
                        data: {
                            chatmembers: {
                                connect:[ ...users.map((id) => ({id})), {id: ctx.currentUser.session.userId}]
                            }
                        }
                    })
                    return {
                        chat
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
    Postmessage: privateProcedure
            .input(z.object({chatId: z.string(), message: z.string()}))
            .mutation( async({ input, ctx }) => {
                try{
                    const { chatId, message } = input;
                    const chat = await ctx.prisma.chat.findFirst({
                        where: { AND:[ {chatid: chatId}, 
                            {chatmembers: {some: {id: ctx.currentUser.session.userId}}}]}})
                    if(chat){
                       const newMessage = await ctx.prisma.chat.update({
                            where: {chatid: chatId},
                            data: {
                                updated_at: new Date(),
                                messages: {
                                    create: {
                                        chatid:chatId,
                                        content:message,
                                        user: {
                                            connect: {id: ctx.currentUser.session.userId}
                                        }
                                    }
                                }
                            },
                       })
                        return {
                            message: newMessage
                        }
                    } else {
                        throw new TRPCError({message: "Chat not found", code: "INTERNAL_SERVER_ERROR"})
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
    getChatList: privateProcedure
    .input(z.object({ cursor: z.object({ updated_at: z.date(), chatid: z.string() }).optional()}))
            .query( async({ ctx, input }) => {
                        const { cursor } = input;
                try{
                    const chatList = await ctx.prisma.authUser.findFirst({
                        where: { id: ctx.currentUser.session.userId },
                        select: {chats: {
                            take: 11,
                            cursor: cursor ? { updated_at_chatid: cursor } : undefined,
                            orderBy: {updated_at: 'desc'},
                            include: {
                                chatmembers: {
                                        where: {id: {not: ctx.currentUser.session.userId}},
                                        select: {
                                            profile:true
                                        }                
                                },
                                messages: {
                                    take: 1,
                                    where: {user: {id: {not: ctx.currentUser.session.userId}}},
                                    orderBy: {created_at: 'desc'}
                                }
   

                        }
                        }}
                    })
               
                    if(!chatList){
                        return {
                            chatList,
                            nextCursor: undefined
                        }
                    }
                let nextCursor: typeof cursor | undefined;
                    if(chatList?.chats?.length > 10){
                        const nextItem = chatList?.chats.pop()
                        if(nextItem != null){
                        nextCursor = {updated_at: nextItem.updated_at, chatid: nextItem.chatid}
                    }
                }
                    return {
                        chatList,
                        nextCursor
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }
            ),
    getChat: privateProcedure
            .input(z.object({chatId: z.string(), userid: z.string()}))
            .query( async({ input, ctx }) => {
                try{
                    const { chatId, userid } = input;
                    const chat = await ctx.prisma.chat.findUnique({
                        where: {chatid: chatId},
                        include: {
                            chatmembers: true,
                            messages: {
                                include: {
                                    user: true
                                },
                            orderBy: {
                                created_at: 'desc'
                                },
                            take:5
                            }
                        }
                    })
                    if(chat){
                        const chatMember = chat.chatmembers.find((member) => member.id === userid);
                        if(chatMember){
                            return {
                                chat
                            }
                        } else {
                            throw new TRPCError({message: "User not found in chat", code: "INTERNAL_SERVER_ERROR"})
                        }
                    } else {
                        throw new TRPCError({message: "Chat not found", code: "INTERNAL_SERVER_ERROR"})
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
    getMessages: privateProcedure
            .input(z.object({chatId: z.string(), cursor: z.object({ created_at: z.date(), messageid: z.string() }).optional()} ))
            .query( async({ input, ctx }) => {
                try{
                    const { chatId, cursor } = input;
                    const chat = await ctx.prisma.chat.findFirst({
                        where: { AND:[
                            {chatid: chatId} ,
                            {chatmembers: {some: {id: ctx.currentUser.session.userId}}}
                        ]
                            },
                        select:{
                            updated_at:true,
                            chatmembers:{ 
                                where: {id: {not: ctx.currentUser.session.userId}},
                                select: {
                                    profile:true
                                }
                            },
                            messages: {
                                include:{
                                    user: {select: {profile: true}
                                }},
                                take: 11,
                                cursor: cursor ? { created_at_messageid: cursor } : undefined,
                                orderBy: {created_at: 'desc'},
                        }
      
                }})  
                console.log({ chat })              
                  if(!chat){
                    return {
                        messages: [],
                        error: "Chat not found"

                    }
                  }
                   let nextCursor: typeof cursor | undefined;
                    if(chat?.messages?.length > 10){
                        const nextItem = chat.messages.pop()
                        if(nextItem != null){
                        nextCursor = {created_at: nextItem.created_at, messageid: nextItem.messageid}
                    }
                }
                const revChat = chat?.messages.reverse()

                return {
                    chat,
                    messages: revChat,
                    nextCursor
                }
            }
                catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
            searchChats: privateProcedure
            .input(z.object({searchTerm: z.string()}))
            .query( async({ input, ctx }) => {
                try{
                    const { searchTerm } = input;
                    const chats = await ctx.prisma.chat.findMany({
                        where: { AND:[
                            {chatmembers: {some: {id: ctx.currentUser.session.userId}}},
                            {chatmembers: {some:{username: searchTerm}}}
                        ]
                            },
                        include:{
                            chatmembers: {
                                where: {id: {not: ctx.currentUser.session.userId}},
                                select: {
                                    profile:true
                                }
                            },
                            messages: {
                                take: 1,
                                orderBy: {created_at: 'desc'}
                            }
                        }
                    })
                    if(!chats){
                        return {
                            chats: []
                        }
                    }
                    return {
                        chats
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    }
                }
            }),

    deleteChat: privateProcedure
            .input(z.object({chatId: z.string()}))
            .mutation( async({ input, ctx }) => {
                try{
                    const { chatId } = input;
                    const chat = await ctx.prisma.chat.findUnique({
                        where: {chatid: chatId},
                        include: {
                            chatmembers: true,
                            messages: true
                        }
                    })
                    if(chat){
                        const chatMember = chat.chatmembers.find((member) => member.id === ctx.currentUser.session.userId);
                        if(chatMember){
                            await ctx.prisma.chat.delete({
                                where: {chatid: chatId}
                            })
                            return {
                                chat
                            }
                        } else {
                            throw new TRPCError({message: "User not found in chat", code: "INTERNAL_SERVER_ERROR"})
                        }
                    } else {
                        throw new TRPCError({message: "Chat not found", code: "INTERNAL_SERVER_ERROR"})
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
            deleteAllMessages: privateProcedure
            .mutation( async({ input, ctx }) => {
                try{
                    const del = await ctx.prisma.message.deleteMany({})
                        return {
                            del
                        }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),


})