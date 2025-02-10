import React from 'react'
import { BsStars } from 'react-icons/bs'
import { CgAdd } from 'react-icons/cg'

const Messages = () => {
  return (
    <section className='ml-[275px] py-4 px-6 border-l  border-black/10 h-full w-full min-h-screen'>
      <div className='flex w-full items-center justify-between text-xl '>
        <h1 className=''>Messages</h1>
        <CgAdd className='text-xl cursor-pointer' size={24} />
      </div>
      
      
    </section>
  )
}

export default Messages