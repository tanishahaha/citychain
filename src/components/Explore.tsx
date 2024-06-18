import React from 'react';
import { BsSearch } from 'react-icons/bs';


const Explore = () => {
  return (
    <section className='ml-[275px] py-4 px-6 border-l  border-black/10 h-full w-full min-h-screen'>
          <div className='flex w-full items-center justify-between text-xl'>
            <h1 className=''>Explore</h1>
            <div className='relative w-[35%] h-full  group text-base'>
              <input type="text" id='searchBox' placeholder='Search Community Topics' className='outline-none peer focus:border-primary focus:border bg-trans w-full h-full rounded-full px-2 py-1 pl-10' />
              <label htmlFor="searchBox" className='absolute top-0 left-0 h-full flex items-center justify-center p-4 text-gray-500 peer-focus:text-primary'>
                <BsSearch className='' />
              </label>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>

          <div className='flex flex-col rounded-xl bg-primary/5 my-5 pb-2'>
            <h3 className='font-semibold text-base my-4 px-4 text-primary'>What's Happening</h3>
            <div>
              {
                Array.from({length:3}).map((_,i)=>(
                  <div key={i} className='hover:bg-white/30 px-4 py-2 last:rounded-b-xl transition duration-200 cursor-pointer'>
                    <div className='font-semibold text-sm'>#trending {i+1}</div>
                    <div className='text-xs text-neutral-400'>35.4k</div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className='flex flex-col rounded-xl bg-primary/5 my-5 pb-2'>
            <h3 className='font-semibold text-base my-4 px-4 text-primary'>You can follow</h3>
            <div>
              {
                Array.from({length:3}).map((_,i)=>(
                  <div key={i} className='hover:bg-white/30 px-4 py-2 gap-2 flex last:rounded-b-xl transition duration-200'>
                    <div className='w-8 h-8 bg-neutral-600 rounded-full flex-none'></div>

                    <div className='flex justify-between w-full'>

                    <div className='flex flex-col cursor-pointer'>
                      <div className='font-semibold text-sm'>Other User</div>
                      <div className='text-gray-500 text-xs'>@otheruser</div>
                    </div>
                    <button className='bg-primary text-white px-4 py-1 rounded-full hover:bg-transparent hover:text-black hover:border-primary hover:border text-sm hover:scale-95 transition duration-300'>Follow</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          </div>
        </section>
  )
}

export default Explore