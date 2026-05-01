import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'
import axios from 'axios' 
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'


const Credits = () => {
  const [plans,setPlans]=useState([])
  const [loading,setLoading]=useState(true)
  const {token} =useAppContext()

  const fetchPlans =async () => {
    try {
      const {data} =await axios.get('/api/credit/plan',{headers:{Authorization:token}})
      if(data.success){
        setPlans(data.plans)
      }else{
        toast.error(data.message || 'Failed to fetch plans')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const purchasePlan= async (planId) => {
    try {
      const {data} =await axios.post('/api/credit/purchase',{planId},{headers:{Authorization:token}})
      if(data.success){
        window.location.href=data.url
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchPlans()
  },[])

  if(loading) return <Loading/>

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-3xl font-medium tracking-tight text-center mb-10 xl:mt-30 text-ink dark:text-dark-ink'>Credit Plans</h2>
      <div className='flex flex-wrap justify-center gap-8'>
        {plans.map((plan)=>(
          <div key={plan._id} className={`border rounded-[16px] backdrop-blur-2xl transition-all p-6 min-w-[300px] flex flex-col ${plan._id==="pro" ? "bg-brand-lavender/30 dark:bg-brand-lavender/20 border-brand-lavender/50 dark:border-brand-lavender/30 shadow-[0_4px_16px_rgba(139,92,246,0.08)] dark:shadow-[0_4px_16px_rgba(139,92,246,0.15)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.12)]" : "bg-white/20 dark:bg-black/30 border-white/40 dark:border-white/10 shadow-md hover:shadow-lg"}`}>
            <div className='flex-1'>
              <h3 className={`text-xl font-semibold mb-2 text-ink dark:text-dark-ink`}>{plan.name}</h3>
              <p className={"text-ink dark:text-dark-ink"}>
                ${plan.price}
                <span className={`text-base font-normal text-muted dark:text-dark-muted`}>{' '}/{plan.credits} credits</span>
              </p>
              <ul className={"text-body dark:text-dark-body"}>
                {plan.features.map((feature,index)=>(
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={()=>toast.promise(purchasePlan(plan._id),{loading:'Processing..'})} className={`mt-6 font-medium py-3 rounded-[12px] transition-all cursor-pointer hover:opacity-90 shadow-md ${plan._id==="pro" ? "bg-brand-lavender dark:bg-brand-lavender text-white hover:shadow-lg" : "bg-white/30 dark:bg-black/40 text-ink dark:text-white backdrop-blur-xl border border-white/40 dark:border-white/20 hover:bg-white/40 dark:hover:bg-black/50"}`}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
