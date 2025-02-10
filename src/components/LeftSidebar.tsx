'use client'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FaHome, FaHashtag, FaBell, FaEnvelope, FaUserCircle, FaLink } from 'react-icons/fa';
import { PiBookmarkSimpleFill } from 'react-icons/pi';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client';
import AuthModel from './AuthModel';


const LeftSidebar = () => {

  const supabase = createClient();
  const [actionToPerform, setActionToPerform] = useState("");
  const [userFullName, setUserFullName] = useState("No user present");
  const [userEmail, setUserEmail] = useState("please login/signup");


  supabase.auth.getUser().then((res) => {
    if (res.data && res.data.user) {
      const user = res.data.user;
      setUserFullName(user.user_metadata.full_name);
      setUserEmail(user.user_metadata.email)
      // console.log("user", )
    } else {
      console.log("no user")
    }
  }).catch(() => {
    console.log("login")
  })

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  useEffect(() => {

    supabase.auth.getSession().then((res) => {
      if (!res.data.session) {
        setActionToPerform("Login")
      } else {
        setActionToPerform("Logout")
      }

    })
  }, []);


  const NavigationItems = [
    {
      title: 'Home',
      icon: FaHome,
      link: '/'
    }, {
      title: 'Explore',
      icon: FaHashtag,
      link: '/explore'

    }, {
      title: 'Notifications',
      icon: FaBell,
      link: '/'

    }, {
      title: 'Messages',
      icon: FaEnvelope,
      link: '/message'

    }, {
      title: 'Profile',
      icon: FaUserCircle,
      link: '/profile'

    }
  ]

  const router = useRouter();

  return (
    <div>
      <section className='fixed w-[250px] h-screen  flex flex-col gap-4 items-stretch'>
        <div>

          <Link href={"/"} className='py-4 text-2xl flex items-center space-x-2 text-primary'>
            <FaLink />
            <p className='font-semibold'>

              City Chain
            </p>
          </Link>

        </div>

        <div className='flex flex-col gap-3  h-screen'>

          {
            NavigationItems.map((item) => (
              <Link className=' rounded-xl p-2 text-lg flex items-center justify-start space-x-1 hover:bg-black/10 transition duration-200 w-[80%]' href={`${item.link.toLowerCase()}`} key={item.title}>
                <div>
                  <item.icon />
                </div>
                <div>
                  {item.title}
                </div>
              </Link>
            ))
          }
          <div className='mt-2'>


            <AuthModel />
          </div>
        </div>

        <div className='py-4 w-full'>
          <button className='rounded-full flex items-center space-x-2 p-2 text-center bg-black/10 transition duration-200 w-full justify-between hover:scale-95 '>
            <div className='flex items-center space-x-2'>
              <div className='rounded-full flex justify-center items-center font-semibold bg-slate-400 w-8 h-8'>
                {userFullName.slice(0, 2)}
              </div>
              <div className='text-left text-xs text-wrap'>
                <div className='font-semibold'>
                  {userFullName}
                </div>
                <div className=''>
                  {userEmail}
                </div>

              </div>

            </div>



          </button>
        </div>

      </section>
    </div>
  )
}

export default LeftSidebar