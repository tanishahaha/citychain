import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
// import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import React from 'react'
import { toast, Toaster } from 'sonner';
import FormClientComponent from '../client-components/FormClientComponent';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/';
import { tweet } from '@/lib/db/schema';

const ComposeTweet = () => {

  async function submitTweet(formData: FormData){
    'use server'

    const issueText=formData.get("issue")
    // console.log(issueText);

    if(!issueText) return;

    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Assuming SUPABASE_URL is a private environment variable
    const supabaseKey = process.env.SECRET_KEY;
    
    if(!supabaseUrl || !supabaseKey) return;
    
    const supabasesserver=new SupabaseClient(supabaseUrl,supabaseKey);
    
    
    const supabase=createClient();
    const {data:userData,error:userError} = await supabase.auth.getUser();
    console.log(userData.user?.id)

    if(userError) return;

    const {data,error}=await supabasesserver.from("tweet").insert({
      profile_id:userData.user?.id,
      text:issueText.toString(),
      id:randomUUID(),
    })
    const profileId = Number(userData.user?.id);
    const tweetId=Number(randomUUID());

    // let err=''
    // const res= await db.insert(tweet).values({ 
    //   id:tweetId,
    //   profileId,
    //   text:issueText.toString(),
    // }).returning().catch(()=>{
    //   err="something wrong with server"
    // });
    console.log("hogaya")

    revalidatePath('/')
    return {data,error};
    

  }
  return (
    <>
    <FormClientComponent serverAction={submitTweet}/>
    </>
  )
}

export default ComposeTweet