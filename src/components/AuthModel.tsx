"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast, Toaster } from 'sonner';

const AuthModel = () => {
    const [isOpen,setIsOpen]=useState(false);
    const supabase=createClient();
    const [email,setEmail]=useState("");
    const [username,setUsername]=useState("");
    const [full_name,setFullName]=useState("");
    const [isLoading,setIsLoading]=useState(false);
    
    useEffect(()=>{
        
        supabase.auth.getSession().then((res)=>{
            if(!res.data.session){
                
                setIsOpen(true);

            }else{
                window.location.href="/";
                console.log(res);
            }
            
        })
    },[]);

    const checkUsername=async()=>{
        const {data,error}=await supabase.from("profiles").select().eq("username",username.trim());

        if(data && data?.length>0){
            console.log(data);
            return toast.error("Username already exists, Please use another one");
        }
    }

    const checkEmail=async()=>{
        const {data,error}=await supabase.from("profiles").select().eq("email",email.trim());

        if(data && data?.length>0){
            console.log(data);
            return toast.error("Email already exists, Please use another one");
        }
        checkUsername();

    }
    
    return (
        <>
        <Toaster/>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <form onSubmit={async(e)=>{
                    e.preventDefault();
                    setIsLoading(true);

                    checkEmail();

                    await supabase.auth.signInWithOtp({
                        email:email.trim(),
                        options:{
                            data:{
                                username,
                                email,
                                full_name,
                            }
                        }
                    })

                    setIsLoading(false);
                    window.location.href="/";
                
                }}>
                <p className='mt-8 text-primary font-semibold tracking-wider text-xl'>Please Sign in</p>

                <Input type='text' placeholder='Full Name'  className='mt-4' onChange={e=>setFullName(e.target.value)}/>

                <Input type='email' placeholder='mail@gmail.com'  className='mt-4' onChange={e=>setEmail(e.target.value)}/>

                <Input type='text' placeholder='username'  className='mt-4' onChange={e=>setUsername(e.target.value)}/>

                <p className='mt-8 text-slate-600 tracking-wide text-sm'>You will recieve a magic link on the provided email.</p>

                <div className='flex w-full justify-end mt-8'>
                    <Button disabled={isLoading}>Login</Button>
                </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default AuthModel