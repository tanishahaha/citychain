import React from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FaHome, FaHashtag, FaBell, FaEnvelope, FaUserCircle, FaLink } from 'react-icons/fa';
import { PiBookmarkSimpleFill } from 'react-icons/pi';
import Link from 'next/link';


const LeftSidebar = () => {
    const NavigationItems = [
        {
          title: 'Home',
          icon: FaHome,
          link: ''
        }, {
          title: 'Explore',
          icon: FaHashtag,
          link: 'explore'

        }, {
          title: 'Notifications',
          icon: FaBell,
          link: ''

        }, {
          title: 'Messages',
          icon: FaEnvelope,
          link: ''

        }, {
          title: 'Bookmarks',
          icon: PiBookmarkSimpleFill,
          link: ''

        }, {
          title: 'Profile',
          icon: FaUserCircle,
          link: 'profile'

        }
      ]
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
                <Link className=' rounded-xl p-2 text-lg flex items-center justify-start space-x-1 hover:bg-black/10 transition duration-200 w-[80%]' href={`/${item.link.toLowerCase()}`} key={item.title}>
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


              <button className='rounded-full text-white tracking-wider bg-primary w-[70%] px-4 py-2 text-base hover:scale-95 transition duration-300 hover:bg-transparent hover:text-black hover:border-primary hover:border'>
                Point Out
              </button>
            </div>
          </div>

          <div className='py-4 w-full'>
            <button className='rounded-full flex items-center space-x-2 p-2 text-center bg-black/10 transition duration-200 w-full justify-between hover:scale-95 '>
              <div className='flex items-center space-x-2'>
                <div className='rounded-full bg-slate-400 w-8 h-8'>
                </div>
                <div className='text-left text-xs text-wrap'>
                  <div className='font-semibold'>
                    web3Galaxy
                  </div>
                  <div className=''>
                    @web3Galaxy
                  </div>

                </div>

              </div>
                <div>
                  <BsThreeDots />
                </div>


            </button>
          </div>

        </section>
    </div>
  )
}

export default LeftSidebar