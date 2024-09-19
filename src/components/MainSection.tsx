
import React from 'react';
import {  BsStars } from 'react-icons/bs'
import ComposeTweet from './server-components/ComposeTweet';
import { getIssues } from '@/lib/supabase/getIssues';
import AllIssues from './client-components/AllIssues';
import { createClient } from '@/utils/supabase/server';

const MainSection = async () => {
  
  const supabase = createClient();
  const {data:userData,error:userError} = await supabase.auth.getUser();

  // if(userError) return;
  

  const resData = await getIssues(userData.user?.id);
  // console.log(resData);

  return (

    <main className='ml-[275px] py-4 px-6 border-l  border-black/10 h-full w-full min-h-screen'>
      <div className='flex w-full items-center justify-between text-xl'>
        <h1 className=''>Home</h1>
        <BsStars className='text-xl' />
      </div>

      <div className='border-t border-b border-black/10 px-4 flex py-6 space-x-2 relative mt-4'>
        <div className='w-10 h-10 bg-slate-400 rounded-full '></div>
        <ComposeTweet />
      </div>

      <div className='flex flex-col'>
        {
          resData?.error && <div>Something wrong with the server</div>
        }
        {
          resData?.data && resData.data.map((issue, i) => (
            <AllIssues key={issue.id} issue={issue} userId={userData.user?.id}/>
          ))
        }
      </div>  
    </main>
  )
}

export default MainSection