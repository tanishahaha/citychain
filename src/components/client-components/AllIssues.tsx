"use server"
import { getLikesCount, isLiked, IssueType } from '@/lib/supabase/getIssues'
import { BsDot } from 'react-icons/bs'
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { MdOutlineInsertComment } from 'react-icons/md';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import LikeButton from './LikeButton';

dayjs.extend(relativeTime);

type IssueProps = {
  issue: any,
  userId:string | undefined
}

const AllIssues = async ({ issue,userId }: IssueProps) => {

  // const { data, error } = await supabase.auth.getUser()

  // if (error || !data?.user) {
  //   console.log("no user")
  // } else {
  //   console.log(data.user)
  // }

  const getIssueLikeCount=await getLikesCount(issue.id);

  

  const isUserHasLiked = await isLiked({issueId:issue.id,userId:userId})
  // console.log(getIssueLikeCount)
  console.log(isUserHasLiked)

  return (
    <div>
      <div className='border-t-[0px] border-black/10 px-4 py-4 border-b-[0.5px] flex space-x-4'>
        <div>
          <div className='w-10 h-10 bg-slate-400 rounded-full'></div>
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center space-x-1'>
            <div className='font-semibold'>{issue.full_name}</div>
            <div className='text-gray-500'>@{issue.username}</div>
            <div className='text-gray-500'>
              <BsDot size={25} />
            </div>
            <div className='text-sm text-black/90 text-gray-500'>
              {
                dayjs(issue.created_at).fromNow()
              }
            </div>
          </div>

          <div className='text-sm mt-1'>
            {issue.text}
          </div>

          <div className='bg-slate-400 w-full h-80 aspect-square rounded-xl mt-2'>

          </div>

          <div className='flex items-center space-x-5 w-full mt-3'>
            <LikeButton issueId={issue.id} likeCount={getIssueLikeCount?.count} isLiked={isUserHasLiked}/>
            <div className='cursor-pointer'>
              <MdOutlineInsertComment size={25} className='hover:scale-105' />
            </div>
            <div className='cursor-pointer'>
              <FaRegShareFromSquare size={25} className='hover:scale-105' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllIssues