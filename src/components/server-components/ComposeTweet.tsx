import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
// import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import React from 'react'
import { toast, Toaster } from 'sonner';
import FormClientComponent from '../client-components/FormClientComponent';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/';
import { tweet } from '@/lib/db/schema';

const ComposeTweet = () => {

  async function submitTweet(formData: FormData) {
    'use server';

    // console.log("formdata",formData);
    const issueText = formData.get("issue")
    const category = formData.get("category")
    const title = formData.get("title");
    const imageU = Array.from(formData.getAll("imageUrls[]"));
    console.log("image;;;", imageU);

    const latitude = formData.get("latitude")?.toString();
    const parsedLatitude = latitude ? parseFloat(latitude) : null;

    const longitude = formData.get("longitude")?.toString();
    const parsedLongitude = longitude ? parseFloat(longitude) : null;

    const locationName = formData.get("locationName")?.toString() || null;

    if (!imageU) return;

    // console.log(category);
    // console.log("formdata:",formData)
    // console.log(issueText);

    if (!issueText) return;


    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Assuming SUPABASE_URL is a private environment variable
    const supabaseKey = process.env.SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) return;

    const supabasesserver = new SupabaseClient(supabaseUrl, supabaseKey);


    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    // console.log("user id: "+userData.user?.id)


    if (userError) return;

    // const {data,error}=await supabasesserver.from("tweet").insert({
    //   profile_id:userData.user?.id,
    //   text:issueText.toString(),
    //   id:randomUUID(),
    // })
    const profileId = userData.user.id;
    const tweetId = randomUUID();

    let err = ''
    // console.log("tweet id :"+tweetId)
    // console.log("profile id :"+profileId)

    const imageUrls = imageU.map((file) => file.toString());

    // for (const pair of formData.entries())
    //   if (pair[0].startsWith('imageUrls')) {
    //     imageUrls.push(pair[1])
    //   }
    // }

    const res = await db.insert(tweet).values({
      id: tweetId,
      profile_id: profileId,
      text: issueText.toString(),
      category: category?.toString(),
      issuesImages: imageUrls,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      location_name: locationName,
      title: title?.toString(),

    }).returning().catch(() => {
      err = "something wrong with serverr"
    });
    console.log(res)

    revalidatePath('/')
    return { data: res, error: err };


  }
  return (
    <>
      <FormClientComponent serverAction={submitTweet} />
    </>
  )
}

export default ComposeTweet