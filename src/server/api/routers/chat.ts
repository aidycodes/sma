import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const chatRouter = createTRPCRouter({
    createChat: privateProcedure
            .input(z.object({users: z.array(z.string()) }))
            .mutation( async({ input, ctx }) => {
                try{
                    const { users } = input;
                    const chatExist = await ctx.prisma.chat.findFirst({
                        where: {
                            chatmembers: {
                                none: {
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
            .input(z.object({chatId: z.string(), userid:z.string(), message: z.string()}))
            .mutation( async({ input, ctx }) => {
                try{
                    const { chatId, userid, message } = input;
                    const chat = await ctx.prisma.chat.findUnique({where: {chatid: chatId}})
                    if(chat){
                        const newMessage = await ctx.prisma.message.create({
                            data: {
                                chatid: chatId,
                                user: {connect: {id: userid}},
                                content:message
                            }
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
                            take: 10,
                            cursor: cursor ? { updated_at_chatid: cursor } : undefined,
                            orderBy: {updated_at: 'desc'},
                            include: {
                                chatmembers: {
                                       // where: {id: {not: ctx.currentUser.session.userId}},
                                        select: {
                                            profile:true
                                        }                
                                },
                                messages: {
                                    take: 1,
                                    orderBy: {created_at: 'desc'}
                                }
   

                        }
                        }}
                    })
                    console.log(chatList)
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
                    const chat = await ctx.prisma.chat.findUnique({
                        where: {chatid: chatId},
                        select:{
                            messages: {
                                take: 11,
                                cursor: cursor ? { created_at_messageid: cursor } : undefined,
                        }
      
                }})                
                  if(!chat){
                    return {
                        messages: []
                    }
                  }
                   let nextCursor: typeof cursor | undefined;
                    if(chat?.messages?.length > 10){
                        const nextItem = chat.messages.pop()
                        if(nextItem != null){
                        nextCursor = {created_at: nextItem.created_at, messageid: nextItem.messageid}
                    }
                }


                return {
                    messages: chat?.messages,
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
            })


})