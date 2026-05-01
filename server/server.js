import express from "express";
import 'dotenv/config'
import cors from "cors"
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditsRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

const app=express()
const PORT=process.env.PORT || 3000

// middleware — connect to DB lazily on each request (cached after first call)
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        console.error('DB connection error:', error)
        res.status(500).json({ success: false, message: 'Database connection failed' })
    }
})

app.use(cors())

// stripe webhooks - register RAW body route BEFORE express.json() so Stripe signature verification gets raw body
app.post('/api/stripe', express.raw({type:'application/json'}), stripeWebhooks)

app.use(express.json())

// routes
app.get('/',(req,res)=>{
    res.send('server is live')
})

app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

// Start server only in non-serverless environments (local dev)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running at port: ${PORT}.`);
    });
}

// Export for Vercel serverless
export default app;