"use client";

import { likeIssue, unlikeIssue } from '@/lib/supabase/getIssues';
import { createClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';
import React, { useTransition } from 'react'
import { AiFillLike } from 'react-icons/ai';
import { BiLike } from 'react-icons/bi';
import { GrLikeFill } from 'react-icons/gr';
import { toast } from 'sonner';

type LikeButtonProps = {
  issueId: string,
  likeCount: number | null | undefined,
  isLiked: boolean | undefined
}
const LikeButton = ({ issueId, likeCount, isLiked }: LikeButtonProps) => {

  let [isLikePending, startTransition] = useTransition();

  const supabase = createClient();

  return (
    <button disabled={isLikePending} onClick={() => {
      supabase.auth.getUser().then((res) => {
        if (res.data && res.data.user) {
          const user = res.data.user;
          console.log(user)
          startTransition(() => isLiked ? unlikeIssue(issueId, user.id) : likeIssue(issueId, user.id));
        } else {
          console.log("login")
          toast.error("please login first to upraise any issue");


        }
      }).catch(() => {
        console.log("login")
        toast.error("please login first to upraise any issue");
      })

    }} className='cursor-pointer flex self-center text-xl font-semibold align-middle  justify-center gap-2'>

      {likeCount ?? 0}

      {
        isLiked ? <AiFillLike size={25} className='hover:scale-95 text-red-600' /> : <BiLike size={25} className='hover:scale-105' />
      }

    </button>
  )
}

export default LikeButton