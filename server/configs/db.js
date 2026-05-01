import mongoose from "mongoose";

let isConnected = false;

const connectDB=async () => {
    if (isConnected) return;

    try {
        mongoose.connection.on('connected',()=>{
            console.log('database connected')
            isConnected = true;
        })
        mongoose.connection.on('disconnected', () => {
            isConnected = false;
        })
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        isConnected = false;
        console.log(error.message);
        throw error;
    }
}

export default connectDB