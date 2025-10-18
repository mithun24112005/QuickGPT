import { request, response } from "express";
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/user.js";

export const stripeWebhooks=async (req,res) => {
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig=request.headers["stripe-signature"]

    let event

    try {
        event=stripe.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`)
    }

    try{
        switch (key) {
            case "payment_intent_succeeded":
                {
                    const paymentIntent=event.data.object;
                    const sessionList=await stripe.checkout.sessions.list({
                        payment_intent:paymentIntent.id,
                    })
                    const session=sessionList.data[0]
                    const {transactionId,appId}=session.metadata

                    if(appId==='quickgpt'){
                        const transaction=await Transaction.findOne({_id:transactionId,isPaid:false})
                        // update credits in user account
                        await User.updateOne({_id:transaction.userId},{$inc:{credits:transaction.credits}})

                        // update credit payment status
                        transaction.isPaid=true
                        await transaction.save()
                    }else{
                        return response.json({recieved:true,message:"Ignored event invalid app"})
                    }
                }
                break;
        
            default:
                console.log("unhandled event type",event.type);
                break;
        }
        response.json({recieved:true})
    }
    catch(error){
        console.error("webhook processting error",error)
        res.status(500).send("internal server error")
    }
}