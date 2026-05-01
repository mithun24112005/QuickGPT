import Transaction from "../models/Transaction.js"
import User from "../models/user.js"
import Stripe from 'stripe'

const plans=[
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

// api controller for getting plans 
export const getPlans=async (req,res) => {
    try {
        res.json({success:true,plans})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// lazy Stripe initialization to avoid crash when env vars are missing at module load time
let _stripe = null;
const getStripe = () => {
    if (!_stripe) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return _stripe;
};

// api controller for purchasing plan
export const purchasePlan=async (req,res) => {
    try {
        const stripe = getStripe();
        const {planId}=req.body
        const userId=req.user._id
        const plan=plans.find(plan=>plan._id===planId)
        if(!plan){
            return res.json({success:false,message:"Invalid plan"})
        }
        // create new transaction
        const transaction=await Transaction.create({
            userId: userId,
            planId:plan._id,
            amount:plan.price,
            credits:plan.credits,
            isPaid:false
        })

        const {origin}=req.headers
        const session = await stripe.checkout.sessions.create({
        line_items: [
            {
            price_data: {
                currency:"usd",
                unit_amount:plan.price*100,
                product_data:{
                    name:plan.name
                }
            },
            quantity: 1,
            },
        ],
        mode: 'payment',
        success_url:`${origin}/loading?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${origin}`,
        metadata:{transactionId:transaction._id.toString(),appId:'quickgpt'},
        expires_at:Math.floor(Date.now()/1000)+30*60,
        });

        res.json({success:true,url:session.url})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// verify payment controller
export const verifyPayment = async (req, res) => {
    try {
        const stripe = getStripe();
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.json({ success: false, message: "Missing session ID" });
        }
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
            const { transactionId, appId } = session.metadata;
            if (appId === "quickgpt" && transactionId) {
                const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });
                if (transaction) {
                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
                    transaction.isPaid = true;
                    await transaction.save();
                    return res.json({ success: true, message: "Payment verified and credits added" });
                } else {
                    return res.json({ success: true, message: "Payment already verified" });
                }
            }
        }
        res.json({ success: false, message: "Payment not completed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}