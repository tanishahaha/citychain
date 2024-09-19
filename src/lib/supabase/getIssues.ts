"use server"
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../types/supabase";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import {db} from "../db/index";
import { pool } from "../db";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.SECRET_KEY;

export type IssueType=Database['public']['Tables']['tweet']['Row'] & {profiles:Pick<Database['public']['Tables']['profiles']['Row'], 'full_name' | 'username'>};

const queryWithCurrentUserId=`
  select tweet.*,profiles.username,profiles.full_name, count(likes.id) as likes_count,
exists(
  select 1
  from likes
  where likes.tweet_id=tweet.id
  and likes.user_id=$1
) as user_has_liked
from tweet
left join likes on tweet.id = likes.tweet_id
join profiles on tweet.profile_id=profiles.id
group by tweet.id,profiles.username,profiles.full_name
order by tweet.created_at desc;
  `;

const queryWithoutCurrentUserId=`
  select tweet.*,profiles.username,profiles.full_name, count(likes.id) as likes_count
from tweet
left join likes on tweet.id = likes.tweet_id
join profiles on tweet.profile_id=profiles.id
group by tweet.id,profiles.username,profiles.full_name
order by tweet.created_at desc;
  `;

export const getIssues = async (currentUserId?:string) => {
  let query=pool.query(queryWithoutCurrentUserId);

  if(currentUserId){
    query=pool.query(queryWithCurrentUserId,[currentUserId]) ;
  }

  try{

    const res= await query;
    return {data:res.rows}
    
  }catch(error){
    return {error:'something wrong with quering the db'}
  }
  


    // if (supabaseUrl && supabaseKey) {
    //   const supabasesserver = new SupabaseClient(supabaseUrl, supabaseKey);
  
    //   return await supabasesserver.from('tweet').select(`*,profiles(*)`).returns<(IssueType)[]>();
  
    //   // console.log(data![0].profiles.username, error);
    // }


    // try{
    //   const res=await db.query.tweet.findMany
    // }
}

export const likeIssue = async (issueId:string, userId:string) => {
  if(!userId) return;

  if(supabaseUrl && supabaseKey){
    const supabasesserver=new SupabaseClient<Database>(supabaseUrl,supabaseKey);

    await supabasesserver.from('likes').insert({
      id:randomUUID(),
      tweet_id:issueId,
      user_id:userId
    })

    revalidatePath('/')
  }
}

export const getLikesCount = async (issueId:string) =>{
  if(supabaseUrl && supabaseKey){
    const supabasesserver=new SupabaseClient<Database>(supabaseUrl,supabaseKey);

    const res=await supabasesserver.from("likes").select("id",{count:"exact"}).eq("tweet_id",issueId);

    // console.log(res);

    return res;
  }
}

export const isLiked = async ({issueId, userId} : {issueId:string, userId:string|undefined}) =>{
  if(!userId) return;
  if(supabaseUrl && supabaseKey){
    const supabasesserver=new SupabaseClient<Database>(supabaseUrl,supabaseKey);

    const {data,error}= await supabasesserver.from("likes").select("id").eq("tweet_id",issueId).eq("user_id",userId).single();

    return Boolean(data?.id)
  }
}

export const unlikeIssue = async (issueId:string,userId:string) => {
  if(supabaseUrl && supabaseKey){
    const supabasesserver=new SupabaseClient<Database>(supabaseUrl,supabaseKey);
    // console.log(userId)

    await supabasesserver.from('likes').delete().eq("tweet_id",issueId).eq("user_id",userId)
    revalidatePath('/')
  }
}
