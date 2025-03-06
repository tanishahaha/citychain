import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { BsStars } from 'react-icons/bs';
import AllIssues from '@/components/client-components/AllIssues';

// Define interfaces matching what AllIssues expects
interface Profile {
  id: string;
  full_name: string | null;
  username: string;
  updated_at: Date;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface Tweet {
  id: string;
  title: string | null;
  text: string;
  status: string;
  created_at: Date;
  profile_id: string;
  authority: string | null;
  updated_at: Date;
  latitude: number | null;
  longitude: number | null;
  category: string;
  issuesImages: string[] | null; // Changed from images to issuesImages
  location_name: string | null;
}

interface Issue {
  userProfiles: Profile;
  tweets: Tweet;
}

export default async function ClaimedIssuesPage() {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error('User authentication error:', userError?.message);
    return (
      <main className='ml-[275px] py-4 px-6 border-l border-black/10 h-full w-full min-h-screen'>
        <div className='flex w-full items-center justify-between text-xl border-b border-black/10 py-4'>
          <h1>Claimed Issues</h1>
          <BsStars size={24} />
        </div>
        <p className="text-center py-8 text-gray-500">Please log in to view claimed issues</p>
      </main>
    );
  }

  const userId = userData.user.id;

  try {
    const { data: claimedIssues, error: issuesError } = await supabase
      .from('tweet')
      .select(`
        id,
        title,
        text,
        status,
        created_at,
        profile_id,
        authority,
        updated_at,
        latitude,
        longitude,
        category,
        images,
        location_name,
        profiles!tweet_profile_id_fkey (
          id,
          full_name,
          username,
          updated_at,
          email,
          latitude,
          longitude
        )
      `)
      .eq('authority', userId)
      .neq('status', 'solved');

    if (issuesError) {
      console.error('Supabase query error:', issuesError);
      throw new Error(issuesError.message);
    }

    console.log('Fetched claimed issues:', claimedIssues);

    return (
      <main className='ml-[275px] py-4 px-6 border-l border-black/10 h-full w-full min-h-screen'>
        <div className='flex w-full items-center justify-between text-xl border-b border-black/10 py-4'>
          <h1>Claimed Issues</h1>
          <BsStars size={24} />
        </div>

        {!claimedIssues || claimedIssues.length === 0 ? (
          <p className="text-center py-8 text-gray-500">You haven't claimed any issues yet</p>
        ) : (
          <div className='flex flex-col'>
            {claimedIssues.map((issue: any) => {
              const formattedIssue: Issue = {
                userProfiles: {
                  id: issue.profiles.id,
                  full_name: issue.profiles.full_name,
                  username: issue.profiles.username,
                  updated_at: new Date(issue.profiles.updated_at),
                  email: issue.profiles.email,
                  latitude: issue.profiles.latitude,
                  longitude: issue.profiles.longitude,
                },
                tweets: {
                  id: issue.id,
                  title: issue.title,
                  text: issue.text,
                  status: issue.status,
                  created_at: new Date(issue.created_at),
                  profile_id: issue.profile_id,
                  authority: issue.authority,
                  updated_at: new Date(issue.updated_at),
                  latitude: issue.latitude,
                  longitude: issue.longitude,
                  category: issue.category,
                  issuesImages: issue.images, // Renamed from images to issuesImages
                  location_name: issue.location_name,
                }
              };
              return (
                <AllIssues
                  key={formattedIssue.tweets.id}
                  issue={formattedIssue}
                  userId={userId}
                />
              );
            })}
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error('Error in ClaimedIssuesPage:', error);
    return (
      <main className='ml-[275px] py-4 px-6 border-l border-black/10 h-full w-full min-h-screen'>
        <div className='flex w-full items-center justify-between text-xl border-b border-black/10 py-4'>
          <h1>Claimed Issues</h1>
          <BsStars size={24} />
        </div>
        <p className="text-center py-8 text-red-500">
          Error loading claimed issues: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </main>
    );
  }
}