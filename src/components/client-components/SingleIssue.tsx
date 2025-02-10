"use client";

import { Profile, Tweet } from '@/lib/db/schema';
import dayjs from 'dayjs';
import React from 'react'
import { BsDot } from 'react-icons/bs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";


type SingleIssueProps = {
  issue:
  {
    userProfiles: Profile,
    tweets: Tweet
  },
}
dayjs.extend(relativeTime);

const SingleIssue = ({ issue }: SingleIssueProps) => {
  const router = useRouter();
  return (
    <div className='flex flex-col w-full' onClick={() => {
      router.push(`/issue/${issue.tweets.id}`)
    }}>

      <div className='flex items-center space-x-1'>
        <div className='font-semibold'>{issue.userProfiles.full_name}</div>
        <div className='text-gray-500'>@{issue.userProfiles.username}</div>
        <div className='text-gray-500'>
          <BsDot size={25} />
        </div>
        <div className='text-sm text-black/90 text-gray-500'>
          {
            dayjs(issue.tweets.created_at).fromNow()
          }
        </div>
      </div>

      <div className='text-sm mt-1'>
        {issue.tweets.text}
      </div>
      {/* <div className='mt-1 text-xs text-red-400'>
        📍
        {
          issue.tweets.location_name
        }
      </div> */}

      <div className=' w-full h-80  rounded-xl mt-2 flex justify-center items-center'>
        <Carousel className='w-[40%]  overflow-hidden '>

          {
            issue.tweets.issuesImages?.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                width={200}
                height={200}
                alt={`Image ${index + 1}`}
                className='w-full h-full'

              />
            ))
          }
        </Carousel>
      </div>


    </div>
  )
}

export default SingleIssue