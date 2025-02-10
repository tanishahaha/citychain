"use client";

import React, { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MdOutlineInsertComment } from 'react-icons/md';
import { Profile, Tweet } from '@/lib/db/schema';
import { BsDot } from 'react-icons/bs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { replyAnIssue } from '@/lib/supabase/getIssues';


dayjs.extend(relativeTime);

type ReplyProps = {
    issue:
    {
        userProfiles: Profile,
        tweets: Tweet
    },
}

const ReplyDialog = ({ issue }: ReplyProps) => {

    const [replyText, setReplyText] = useState("");
    let [isLikePending, startTransition] = useTransition();
    const [openDialog,setOpenDialog]=useState(false);

  const supabase = createClient();

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <Button className='bg-transparent text-black hover:bg-transparent px-1'><MdOutlineInsertComment size={25} className='hover:scale-105' /></Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-xl max-w-md">

                    <div className='border-t-[0px] border-black/20 px-2 py-4 border-b-[0.5px] flex space-x-4'>
                        <div>
                            <div className='w-10 h-10 bg-slate-400 rounded-full'></div>
                        </div>
                        <div className='flex flex-col w-full'>
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



                        </div>
                    </div>
                    <div className='px-2 py-2 flex flex-col gap-2 '>

                        <div className=''>
                            Replying to <span className='text-blue-500'>@{issue.userProfiles.username}</span>
                        </div>
                        <div className='px-4 py-1 flex w-full items-center gap-2'>
                            <div>
                                <div className='w-7 h-7 bg-slate-400 rounded-full'></div>
                            </div>
                            <textarea className='w-full h-full text-base bg-transparent border-none  outline-none ' placeholder='Type here...' value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                        </div>

                        <div className='flex justify-end'>

                            <button type='submit' className='rounded-full text-white tracking-wider bg-primary px-4 py-1 text-base hover:scale-95 transition duration-300' disabled={isLikePending} onClick={() => {
                                supabase.auth.getUser().then((res) => {
                                    if (res.data && res.data.user) {
                                        const user = res.data.user;
                                        console.log(user)
                                        startTransition(()=>{
                                            replyAnIssue({
                                                tweet_id:issue.tweets.id,
                                                user_id:user.id,
                                                replyText
                                            })
                                        });
                                        setReplyText("");
                                        toast.success("Reply send successfully");
                                        setOpenDialog(false);
                                        console.log("reply success")
                                    } else {
                                        console.log("login")
                                        toast.error("please login first to reply any issue");


                                    }
                                }).catch(() => {
                                    console.log("login")
                                    toast.error("please login first to reply any issue");
                                })

                            }}>
                                Reply
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ReplyDialog