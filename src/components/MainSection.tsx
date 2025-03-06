
import React from 'react';
import { BsStars } from 'react-icons/bs'
import ComposeTweet from './server-components/ComposeTweet';
import { getIssues, getTweetByLocation } from '@/lib/supabase/getIssues';
import AllIssues from './client-components/AllIssues';
import { createClient } from '@/utils/supabase/server';
// import ImageAddDialog from './client-components/ImageAddDialog';
import { BiPlus } from 'react-icons/bi';
import { Button } from './ui/button';
import RegisterAuthority from './server-components/RegisterAuthority';
import { checkIfRegistered } from '@/actions/check-if-registered';

const MainSection = async () => {

  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log(userData)

  const isRegistered = await checkIfRegistered();


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
      <div className='flex w-full items-center justify-between text-xl border-b border-black/10 py-4'>
        <h1 className=''>Home</h1>

        {
          isRegistered ? <BsStars size={24} /> : <RegisterAuthority />
        }

      </div>




      {
        !isRegistered && <div className=' border-b border-black/10 px-4 flex py-4 space-x-2 relative mt-4'><ComposeTweet /></div>
      }


      <div className='flex flex-col'>

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

        {/* {userData.user === null && resData &&
          resData.data?.map(({ likes, tweet, profile, hasLiked }) => {
            return (
              <AllIssues
                key={tweet.id}
                issue={{
                  userProfiles: {
                    ...profile,
                  },
                  tweets: {
                    ...tweet,
                  }
                }}
                userId={''}

              />
            );
          })} */}

      </div>
    </main>
  )
}

export default MainSection