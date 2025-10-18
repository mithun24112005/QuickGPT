// api controller for creating a new chat

import Chat from "../models/Chat.js"

export const createChat = async (req, res) => {
    try {
        const userId = req.user._id
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }
        await Chat.create(chatData)
        res.json({ success: true, message: "Chat created" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// api controller for getting all chats
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 })
        res.json({ success: true, chats })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// api for deleting a chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId } = req.body
        const chat = await Chat.findOneAndDelete({ _id: chatId, userId })
        if (!chat) {
            return res.json({ success: false, message: "Chat not found or not authorized" })
        }
        res.json({ success: true, message: "Chat is deleted successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
