// text-based ai chat message controller

import Chat from "../models/Chat.js"
import User from "../models/user.js"
import axios from "axios"
import imagekit from "../configs/imageKit.js"
import geminiAI from '../configs/openai.js'

export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        // check credits
        if (req.user.credits < 1) {
            return res.json({ success: false, message: "you dont have enough credits to use this feature" })
        }

        const { chatId, prompt } = req.body
        const chat = await Chat.findOne({ userId, _id: chatId })
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" })
        }
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })

        const response = await geminiAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        const text = response.text;

        const reply = {
            role: "assistant",
            content: text,
            timestamp: Date.now(),
            isImage: false
        };

        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
        // console.log(response.choices[0].message);
    } catch (error) {
        console.log('Error in textMessageController:', error);
        console.log('Error status:', error.status);
        console.log('Error response:', error.response?.data);

        let errorMessage = error.message;
        if (error.status === 429) {
            errorMessage = "API rate limit exceeded. Please wait a moment and try again.";
        }

        res.json({ success: false, message: errorMessage })
    }
}

// image generation message controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        // check credits
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "you dont have enough credits to use this feature" })
        }
        const { prompt, chatId, isPublished } = req.body
        // find chat
        const chat = await Chat.findOne({ userId, _id: chatId })
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" })
        }
        // push user message 
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })

        // encode the prompt 
        const encoded_prommpt = encodeURIComponent(prompt)

        // construct image ai generation url
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encoded_prommpt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`

        // trigger generation by fetching from Imagekit
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" })

        // convert arraybuffer to base64 data URI
        const base64Image = Buffer.from(aiImageResponse.data, 'binary').toString('base64')
        const base64File = `data:image/png;base64,${base64Image}`

        // upload to imagekit media library using new API (files.upload)
        const uploadResponse = await imagekit.files.upload({
            file: base64File,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt",
        })

        const imageUrl = uploadResponse.url || uploadResponse.filePath || uploadResponse.filePathUrl
        const reply = { role: 'assistant', content: imageUrl, timestamp: Date.now(), isImage: true, isPublished }
        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}