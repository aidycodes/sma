import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const chatRouter = createTRPCRouter({
    create: privateProcedure
            .input(z.object({users: z.array(z.string()) }))
            .mutation( async({ input, ctx }) => {
                try{
                    const { users } = input;
                    const chat = await ctx.prisma.chat.create({
                        data: {
                            chatmembers: {
                                connect: users.map((id) => ({id}))
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
    message: privateProcedure
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
            .input(z.object({userid: z.string()}))
            .query( async({ input, ctx }) => {
                try{
                    const { userid } = input;
                    const chats = await ctx.prisma.chat.findMany({
                        where: {
                            chatmembers: {
                                some: {
                                    id: userid
                                }
                            }
                        },
                        include: {
                            chatmembers: true,
                            messages: {
                                include: {
                                    user: true
                                },
                            take:1,
                            orderBy: {
                                created_at: 'desc'
                                }
                            }
                        }
                    })
                    return {
                        chats
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            }),
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
                            take:20
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
            .input(z.object({chatId: z.string(), userid: z.string(), skip: z.number().optional(), take: z.number().optional()}))
            .query( async({ input, ctx }) => {
                try{
                    const { chatId, userid, skip, take } = input;
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
                            skip: skip || 0,
                            take: take || 20
                            }
                        }
                    })
                    if(chat){
                        const chatMember = chat.chatmembers.find((member) => member.id === userid);
                        if(chatMember){
                            return {
                                messages: chat.messages
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
            })


})