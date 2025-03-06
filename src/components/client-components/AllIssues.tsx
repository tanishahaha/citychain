"use server";
import { getLikesCount, isLiked } from '@/lib/supabase/getIssues';
import { MdOutlineLocationOn } from 'react-icons/md';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import LikeButton from './LikeButton';
import ReplyDialog from './ReplyDialog';
import SingleIssue from './SingleIssue';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Profile, Tweet } from '@/lib/db/schema';
import { checkIfRegistered } from '@/actions/check-if-registered';
import { Button } from '../ui/button';
import { claimIssue, markAsSolved } from '@/actions/issue-actions';

dayjs.extend(relativeTime);

type IssueProps = {
  issue: {
    userProfiles: Profile;
    tweets: Tweet;
  };
  userId: string | undefined;
};

const AllIssues = async ({ issue, userId }: IssueProps) => {
  const likeCount = await getLikesCount(issue.tweets.id);
  const hasUserLiked = await isLiked({ issueId: issue.tweets.id, userId });
  const isRegistered = await checkIfRegistered()
  const isCurrentAuthority = isRegistered && issue.tweets.authority === userId;

  return (
    <div className='border-t-[0px] hover:bg-black/5 cursor-pointer border-black/10 px-4 py-4 border-b-[0.5px] flex space-x-4'>
      <div>
        <div className='w-10 h-10 flex justify-center items-center font-semibold bg-slate-400 rounded-full'>{issue.userProfiles.full_name?.slice(0, 2)}</div>
      </div>
      <div className='flex flex-col w-full'>
        <SingleIssue issue={issue} />
        <div className='text-sm text-gray-500 mb-2'>
          Status: <span className={getStatusStyle(issue.tweets.status)}>{issue.tweets.status}</span>
        </div>
        <div className='flex items-center space-x-5 w-full'>
          <LikeButton issueId={issue.tweets.id} likeCount={likeCount?.count} isLiked={hasUserLiked} />
          <ReplyDialog issue={issue} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <MdOutlineLocationOn size={25} className='hover:scale-105 cursor-pointer' />
              </TooltipTrigger>
              <TooltipContent>{issue.tweets.location_name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <FaRegShareFromSquare size={25} className='hover:scale-105 cursor-pointer' />

          {isRegistered && (
            <div className='flex space-x-2'>
              {issue.tweets.status === 'pending' && (
                <form action={claimIssue}>
                  <input type='hidden' name='issueId' value={issue.tweets.id} />
                  <input type='hidden' name='userId' value={userId} />
                  <Button type='submit'>Claim Issue</Button>
                </form>
              )}
              {isCurrentAuthority && issue.tweets.status === 'under_consideration' && (
                <form action={markAsSolved}>
                  <input type='hidden' name='issueId' value={issue.tweets.id} />
                  <Button type='submit'>Mark as Solved</Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return 'text-yellow-500 font-semibold';
    case 'under_consideration':
      return 'text-orange-500 font-semibold';
    case 'solved':
      return 'text-green-500 font-semibold';
    default:
      return 'text-gray-500';
  }
};

export default AllIssues;
