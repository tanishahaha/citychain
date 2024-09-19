"use client";

import { PostgrestError } from '@supabase/supabase-js';
import React, { useState } from 'react'
import { toast, Toaster } from 'sonner';

type FormClientComponentProps={
    serverAction: any,
};

const FormClientComponent = ({serverAction}:FormClientComponentProps) => {

    const handleSubmitIssue=async (data:any)=>{

        try{

            const res=await serverAction(data);
            if(res?.error){
                return toast.error(res.error.message);
            }
            setInputFieldValue('');
    
            return toast.success("Issue raised successfully");
        }
        catch(error){
            console.log(error);
        }
    }

    const [inputFieldValue, setInputFieldValue] = useState('');

  return (
    <>
    <Toaster/>
    <form  className='flex flex-col w-full  h-full px-2' 
    action={
        handleSubmitIssue as any
    }
    >
              <input type="text" name="issue" placeholder="What's Happening?" className='w-full h-full text-base bg-transparent border-none  outline-none ' value={inputFieldValue} onChange={(e) => setInputFieldValue(e.target.value)}/>
              <div className='w-full justify-between items-center flex'>
                <div></div>
                <div className=''>
                <button type='submit' className='rounded-full text-white tracking-wider bg-primary px-4 py-1 text-base hover:scale-95 transition duration-300'>
                Submit
              </button>
                </div>
              </div>
            </form>
    </>
  )
}

export default FormClientComponent