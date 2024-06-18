import React from 'react';
import { BiLike } from 'react-icons/bi'
import { BsDot, BsStars } from 'react-icons/bs'
import { FaRegShareFromSquare } from 'react-icons/fa6'
import { MdOutlineInsertComment } from 'react-icons/md'

const MainSection = () => {
  return (
    <main className='ml-[275px] py-4 px-6 border-l  border-black/10 h-full w-full min-h-screen'>
          <div className='flex w-full items-center justify-between text-xl'>
            <h1 className=''>Home</h1>
            <BsStars className='text-xl' />
          </div>

          <div className='border-t border-b border-black/10 px-4 flex py-6 space-x-2 relative mt-4'>
            <div className='w-10 h-10 bg-slate-400 rounded-full '></div>
            <div className='flex flex-col w-full  h-full px-2'>
              <input type="text" placeholder="What's Happening?" className='w-full h-full text-base bg-transparent border-none  outline-none ' />
              <div className='w-full justify-between items-center flex'>
                <div></div>
                <div className=''>
                <button className='rounded-full text-white tracking-wider bg-primary px-4 py-1 text-base hover:scale-95 transition duration-300'>
                Submit
              </button>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            {
              Array.from({length:5}).map((_, i) => (
                <div key={i} className='border-t-[0px] border-black/10 px-4 py-4 border-b-[0.5px] flex space-x-4'>
                  <div>
                    <div className='w-10 h-10 bg-slate-400 rounded-full'></div>
                  </div>
                  <div className='flex flex-col '>
                    <div className='flex items-center space-x-1'>
                      <div className='font-semibold'>web3Galaxy</div>
                      <div className='text-gray-500'>@web3Galaxy</div>
                      <div className='text-gray-500'>
                        <BsDot/>
                      </div>
                      <div className='text-sm text-black/90 text-gray-500'>1 hour ago</div>
                    </div>

                    <div className='text-sm mt-1'>
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione consectetur quisquam repellat veritatis illum rerum rem, dolores cupiditate excepturi, vero dolor repudiandae ex eius molestias necessitatibus deleniti, est tempore dolore.
                    </div>

                    <div className='bg-slate-400 w-full h-80 aspect-square rounded-xl mt-2'>

                    </div>

                    <div className='flex items-center space-x-5 w-full mt-3'>
                      <div className='cursor-pointer'>
                        <BiLike size={25} className='hover:scale-105'/>
                      </div>
                      <div className='cursor-pointer'>
                        <MdOutlineInsertComment size={25} className='hover:scale-105'/>
                      </div>
                      <div className='cursor-pointer'>
                        <FaRegShareFromSquare size={25} className='hover:scale-105'/>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </main>
  )
}

export default MainSection