"use client";
import { getTweetByCategory } from '@/lib/supabase/getIssues';
import { createClient } from '@/utils/supabase/client';
import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import dynamic from 'next/dynamic';
import { clientCheckIfRegistered } from '@/actions/client-check-if-registered';

const AllIssues = dynamic(() => import('./client-components/AllIssues'), { ssr: false });

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // State to track registration status
  const [loading, setLoading] = useState<boolean>(true); // Optional: to handle loading state

  const categories = [
    "Environmental",
    "Safety",
    "Social inequality",
    "Education",
    "Healthcare",
    "Transportation"
  ];

  // Fetch registration status when component mounts
  useEffect(() => {
    const checkRegistration = async () => {
      const registered = await clientCheckIfRegistered();
      setIsRegistered(registered);
      setLoading(false); // Set loading to false once check is complete
    };
    checkRegistration();
  }, []); // Empty dependency array means this runs once on mount

  const onCategoryClick = async (category: string) => {
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("User not authenticated.");
      return;
    }

    setUserId(userData.user.id);
    setSelectedCategory(category);

    const fetchedIssues = await getTweetByCategory(category.toLowerCase(), userData.user.id);

    if (!fetchedIssues?.data || fetchedIssues.data.length === 0) {
      console.error("No issues found for this category.");
      setIssues([]);
      return;
    }

    setIssues(fetchedIssues.data);
  };

  // Optional: Render a loading state while checking registration
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='ml-[275px] py-4 px-6 border-l border-black/10 h-full w-full min-h-screen'>
      <div className='flex w-full items-center justify-between text-xl'>
        <h1>Explore</h1>
        <div className='relative w-[35%] h-full group text-base'>
          <input
            type="text"
            id='searchBox'
            placeholder='Search Community Topics'
            className='outline-none peer focus:border-primary focus:border bg-trans w-full h-full rounded-full px-2 py-1 pl-10'
          />
          <label htmlFor="searchBox" className='absolute top-0 left-0 h-full flex items-center justify-center p-4 text-gray-500 peer-focus:text-primary'>
            <BsSearch />
          </label>
        </div>
      </div>

      <div className='grid gap-4'>
        <div className='flex flex-col rounded-xl bg-primary/5 my-5 pb-2'>
          <h3 className='font-semibold text-base my-4 px-4 text-primary'>Browse Categories</h3>
          <div className='grid grid-cols-3 gap-2'>
            {categories.map((category, index) => (
              <div
                key={index}
                className='hover:bg-white/30 px-4 py-2 last:rounded-b-xl transition duration-200 cursor-pointer'
                onClick={() => onCategoryClick(category)}
              >
                <div className='font-semibold text-sm'>👉{category}</div>

                {/* <div className='text-xs text-neutral-400'>35.4k</div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Display Issues */}
        {issues.length > 0 && issues.map(({ tweet, profile }) => (
          <AllIssues
            key={tweet.id}
            userId={userId}
            issue={{
              userProfiles: { ...profile },
              tweets: { ...tweet },
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Explore;