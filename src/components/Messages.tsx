"use client"
import { getAllUsers } from '@/actions/get-all-users'
import React, { useEffect, useState } from 'react'
import { BsStars } from 'react-icons/bs'
import { CgAdd } from 'react-icons/cg'
import { User } from '../../types/app'
import { useRouter } from 'next/navigation'

const Messages = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchUsers = await getAllUsers();
      setUsers(fetchUsers);
    };
    fetchUsers();
  }, [])


  const handleClick = (id: string) => {
    router.push(`/directMessage/${id}`)

  }
  return (
    <section className='ml-[275px] py-4 px-6 border-l  border-black/10 h-full w-full min-h-screen'>
      <div className='flex w-full items-center justify-between text-xl '>
        <h1 className=''>Messages</h1>
        <CgAdd className='text-xl cursor-pointer' size={24} />

      </div>

      <div className='mt-4'>
        {
          users ? (
            users.length > 0 ? (
              users.map(
                user => (
                  <div key={user.id} className='p-2 border-b border-gray-200 cursor-pointer' onClick={() => handleClick(user.id)}>
                    {user.full_name}
                  </div>
                )
              )
            ) : (
              <p>No users found</p>
            )
          ) : (
            <p>Loading users</p>
          )
        }
      </div>


    </section>
  )
}

export default Messages