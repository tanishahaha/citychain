'use client';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaHome, FaHashtag, FaBell, FaEnvelope, FaUserCircle, FaLink, FaHammer, FaCheck } from 'react-icons/fa';
import { PiBookmarkSimpleFill } from 'react-icons/pi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AuthModel from './AuthModel';

const LeftSidebar = () => {
  const supabase = createClient();
  const router = useRouter();
  const [actionToPerform, setActionToPerform] = useState('');
  const [userFullName, setUserFullName] = useState('No user present');
  const [userEmail, setUserEmail] = useState('please login/signup');
  const [isRegistered, setIsRegistered] = useState(false); // New state for authority status
  const [loading, setLoading] = useState(true); // Optional: Handle loading state

  // Fetch user data and check registration status
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setUserFullName('No user present');
        setUserEmail('please login/signup');
        setActionToPerform('Login');
        setIsRegistered(false);
        setLoading(false);
        return;
      }

      // Set user info
      setUserFullName(user.user_metadata.full_name || 'Unknown');
      setUserEmail(user.user_metadata.email || user.email || 'No email');
      setActionToPerform('Logout');

      // Check if user is registered as an authority
      const { data, error } = await supabase
        .from('authorities')
        .select('profile_id')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking registration:', error);
        setIsRegistered(false);
      } else {
        setIsRegistered(!!data); // True if data exists, false if null
      }
      setLoading(false);
    };

    fetchUserData();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/'); // Redirect after logout
  }

  const NavigationItems = [
    { title: 'Home', icon: FaHome, link: '/' },
    { title: 'Explore', icon: FaHashtag, link: '/explore' },
    { title: 'Notifications', icon: FaBell, link: '/notifications' },
    { title: 'Messages', icon: FaEnvelope, link: '/message' },
    { title: 'Profile', icon: FaUserCircle, link: '/profile' },
  ];

  const AuthorityNavigationItems = [
    { title: 'Home', icon: FaHome, link: '/' },
    { title: 'Issues', icon: FaHashtag, link: '/authorityexplore' },
    { title: 'Notifications', icon: FaBell, link: '/notifications' },
    {title: 'Claimed',icon:FaHammer,link:'/claimed'},
    {title: 'Solved',icon:FaCheck,link:'/solved'},
    { title: 'Profile', icon: FaUserCircle, link: '/profile' },
  ];

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div>
      <section className="fixed w-[250px] h-screen flex flex-col gap-4 items-stretch">
        <div>
          <Link href="/" className="py-4 text-2xl flex items-center space-x-2 text-primary">
            <FaLink />
            <p className="font-semibold">City Chain</p>
          </Link>
        </div>

        <div className="flex flex-col gap-3 h-screen">
          {(isRegistered ? AuthorityNavigationItems : NavigationItems).map((item) => (
            <Link
              className="rounded-xl p-2 text-lg flex items-center justify-start space-x-1 hover:bg-black/10 transition duration-200 w-[80%]"
              href={item.link.toLowerCase()}
              key={item.title}
            >
              <div>
                <item.icon />
              </div>
              <div>{item.title}</div>
            </Link>
          ))}
          <div className="mt-2">
            <AuthModel />
          </div>
        </div>

        <div className="py-4 w-full">
          <button className="rounded-full flex items-center space-x-2 p-2 text-center bg-black/10 transition duration-200 w-full justify-between hover:scale-95">
            <div className="flex items-center space-x-2">
              <div className="rounded-full flex justify-center items-center font-semibold bg-slate-400 w-8 h-8">
                {userFullName.slice(0, 2)}
              </div>
              <div className="text-left text-xs text-wrap">
                <div className="font-semibold">{userFullName}</div>
                <div>{userEmail}</div>
              </div>
            </div>
            {/* {actionToPerform === 'Logout' && (
              <button onClick={handleLogout} className="text-sm">
                Logout
              </button>
            )} */}
          </button>
        </div>
      </section>
    </div>
  );
};

export default LeftSidebar;