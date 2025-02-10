
import React from 'react';
import { BsStars } from 'react-icons/bs'
import ComposeTweet from './server-components/ComposeTweet';
import { getIssues, getTweetByLocation } from '@/lib/supabase/getIssues';
import AllIssues from './client-components/AllIssues';
import { createClient } from '@/utils/supabase/server';
// import ImageAddDialog from './client-components/ImageAddDialog';
import { BiPlus } from 'react-icons/bi';

const MainSection = async () => {

  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log(userData)


  // if(userError) return;

  const userId = userData.user?.id


  const resData = await getIssues(userId);

  const { data: profileData, error: profileError } = await supabase.from('profiles').select('latitude, longitude').eq('id', userId).single();

  if (profileError) return;

  const { latitude, longitude } = profileData || {};

  let locationBasedTweets = null;
  if (latitude && longitude) {
    locationBasedTweets = await getTweetByLocation(latitude, longitude);
  }




  // console.log(resData);

  return (

    <main className='ml-[275px] py-4 px-6 border-l  border-black/10 h-full w-full min-h-screen'>
      <div className='flex w-full items-center justify-between text-xl'>
        <h1 className=''>Home</h1>
        <BsStars className='text-xl' />
      </div>

      <div className='border-t border-b border-black/10 px-4 flex py-6 space-x-2 relative mt-4'>

        <ComposeTweet />
      </div>

      <div className='flex flex-col'>
        {/* {
          resData?.error && <div>Something wrong with the server</div>
        } */}
        {
          locationBasedTweets && locationBasedTweets.data?.map(({ likes, profile, tweet }) => (
            <AllIssues key={tweet.id} issue={{
              userProfiles: {
                ...profile,
              },
              tweets: {
                ...tweet,
              }
            }} userId={userData.user?.id} />
          ))
        }

        {/* {resData &&
          resData.map(({ likes, tweet, profiles, hasLiked }) => {
            return (
              <AllIssues
                key={tweet.id}
                issue={{
                  userProfiles:{
                    ...profiles,
                  },
                  tweets:{
                    ...tweet,
                  }
                }
                  userId={userData.user?.id}
                
              />
            );
          })} */}
      </div>
    </main>
  )
}

export default MainSection