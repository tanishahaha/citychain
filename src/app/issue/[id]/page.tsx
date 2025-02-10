import SharedLayout from '@/app/sharedlayout'
import AllIssues from '@/components/client-components/AllIssues';
import { db } from '@/lib/db';
import { replies } from '@/lib/db/schema';
import { getAPaticularIssueWithReply } from '@/lib/supabase/getIssues';
import { createClient } from '@/utils/supabase/server'
import { eq } from 'drizzle-orm';
import React from 'react'

const page = async ({params}:{params:{id:string}}) => {

    const supabase=createClient();
    const {data:userData, error:userError} = await supabase.auth.getUser();

    if(userError) return <div className='w-full min-h-screen items-center flex justify-center text-lg text-red-500'>Please log in first</div>;

    console.log("user id:"+userData.user.id);

    console.log(params);

    const userId=userData.user.id;
    const tweetId=params.id;

    const resData = await getAPaticularIssueWithReply({userId,tweetId});


    const repliesOfThatIssue= await db.query.replies.findMany({
        with:{
            profiles:true,
        },
        where: eq(replies.tweet_id,tweetId)
    })

    console.log(repliesOfThatIssue)

    
  return (
    <>
    
        <div className='ml-[275px] py-4 px-6 border-l border-black/10 h-full w-full min-h-screen'>
        <div className='flex flex-col'>
        {
          resData?.error && <div>Something wrong with the server</div>
        }
        {
           resData && resData.data?.map(({likes,profile,tweet}) => (
             <AllIssues key={tweetId} issue={{
              userProfiles:{
                ...profile,
              },
              tweets:{

                ...tweet,
              }
             }} userId={userData.user?.id}/>
           ))
         }
      </div> 
      <div className='flex flex-col w-full'>
        <h2 className='py-2 text-lg font-semibold'>{repliesOfThatIssue.length>0?(<div className='text-primary'>Replies :</div>):(<div className='text-red-500 text-center'>No Replies yet</div>)}</h2>
        {
          repliesOfThatIssue.map((reply)=>{
            return(
              <>
              <div key={reply.id} className=' border-black/20 px-12 py-4 border-b-[0.5px] flex space-x-4'>
                        <div>
                            <div className='w-10 h-10 bg-slate-400 rounded-full'></div>
                        </div>
                        <div className='flex flex-col w-full'>
                            <div className='flex items-center space-x-1'>
                                <div className='font-semibold'>@{reply.profiles.username}</div>
                                
                                
                            </div>

                            <div className='text-sm mt-1'>
                                {reply.text}
                            </div>



                        </div>
                    </div>
              </>
            )
          })
        }
        </div>
        </div>
        
    
    </>
  )
}

export default page