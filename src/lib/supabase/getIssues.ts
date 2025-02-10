"use server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../types/supabase";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "../db/index";
import { pool } from "../db";
import {
  Like,
  likes,
  Profile,
  profiles,
  replies,
  Tweet,
  tweet,
} from "../db/schema";
import { and, desc, eq, exists, sql } from "drizzle-orm";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SECRET_KEY;

export type IssueType = Database["public"]["Tables"]["tweet"]["Row"] & {
  profiles: Pick<
    Database["public"]["Tables"]["profiles"]["Row"],
    "full_name" | "username"
  >;
};

const queryWithCurrentUserId = `
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

const queryWithoutCurrentUserId = `
  select tweet.*,profiles.username,profiles.full_name, count(likes.id) as likes_count
from tweet
left join likes on tweet.id = likes.tweet_id
join profiles on tweet.profile_id=profiles.id
group by tweet.id,profiles.username,profiles.full_name
order by tweet.created_at desc;
  `;

export const getIssues = async (currentUserId?: string) => {
  // let query=pool.query(queryWithoutCurrentUserId);

  // if(currentUserId){
  //   query=pool.query(queryWithCurrentUserId,[currentUserId]) ;
  // }

  // try{

  //   const res= await query;
  //   return {data:res.rows}

  // }catch(error){
  //   return {error:'something wrong with quering the db'}
  // }

  // if (supabaseUrl && supabaseKey) {
  //   const supabasesserver = new SupabaseClient(supabaseUrl, supabaseKey);

  //   return await supabasesserver.from('tweet').select(`*,profiles(*)`).returns<(IssueType)[]>();

  //   // console.log(data![0].profiles.username, error);
  // }

  // try{
  //   const res=await db.query.tweet.findMany
  // }

  try {
    console.log(currentUserId);
    const res = await db
      .select({
        tweet,
        profiles,
        ...(currentUserId
          ? {
              hasLiked: exists(
                db
                  .select()
                  .from(likes)
                  .where(
                    and(
                      eq(likes.tweet_id, tweet.id),
                      eq(likes.user_id, currentUserId)
                    )
                  )
              ),
            }
          : {}),
        likes,
      })
      .from(tweet)
      .leftJoin(likes, eq(tweet.id, likes.tweet_id))
      .innerJoin(profiles, eq(tweet.profile_id, profiles.id))
      .orderBy(desc(tweet.created_at));

    const rows = await res;

    if (rows) {
      const result = rows.reduce<
        Record<
          string,
          {
            tweet: Tweet;
            likes: Like[];
            profile: Profile;
            hasLiked: boolean;
            replies: Tweet[];
          }
        >
      >((acc, row) => {
        const tweet = row.tweet;
        const like = row.likes;
        const profile = row.profiles;
        const hasLiked = Boolean(row.hasLiked);
        // const reply = row.tweetsReplies;

        if (!acc[tweet.id]) {
          acc[tweet.id] = {
            tweet,
            likes: [],
            profile,
            hasLiked,
            replies: [],
          };
        }

        if (like) {
          acc[tweet.id].likes.push(like);
          const ids = acc[tweet.id].likes.map(({ id }) => id);
          const filteredLikesArr = acc[tweet.id].likes.filter(
            ({ id }, index) => !ids.includes(id, index + 1)
          );
          acc[tweet.id].likes = filteredLikesArr;
        }

        return acc;
      }, {});

      const data = Object.values(result);
      // console.log(data);
      return {data};
    }
  } catch (error) {
    console.log(error);
    return { error: "something wrong with querying the db" };
  }
};

export const likeIssue = async (issueId: string, userId: string) => {
  if (!userId) return;

  if (supabaseUrl && supabaseKey) {
    const supabasesserver = new SupabaseClient<Database>(
      supabaseUrl,
      supabaseKey
    );

    // await supabasesserver.from('likes').insert({
    //   id:randomUUID(),
    //   tweet_id:issueId,
    //   user_id:userId
    // })

    await db.insert(likes).values({
      id: randomUUID(),
      tweet_id: issueId,
      user_id: userId,
    });

    revalidatePath("/");
  }
};

export const getLikesCount = async (issueId: string) => {
  if (supabaseUrl && supabaseKey) {
    const supabasesserver = new SupabaseClient<Database>(
      supabaseUrl,
      supabaseKey
    );

    const res = await supabasesserver
      .from("likes")
      .select("id", { count: "exact" })
      .eq("tweet_id", issueId);

    // console.log(res);

    return res;
  }
};

export const isLiked = async ({
  issueId,
  userId,
}: {
  issueId: string;
  userId: string | undefined;
}) => {
  if (!userId) return;
  if (supabaseUrl && supabaseKey) {
    const supabasesserver = new SupabaseClient<Database>(
      supabaseUrl,
      supabaseKey
    );

    const { data, error } = await supabasesserver
      .from("likes")
      .select("id")
      .eq("tweet_id", issueId)
      .eq("user_id", userId)
      .single();

    return Boolean(data?.id);
  }
};

export const unlikeIssue = async (issueId: string, userId: string) => {
  if (supabaseUrl && supabaseKey) {
    const supabasesserver = new SupabaseClient<Database>(
      supabaseUrl,
      supabaseKey
    );
    // console.log(userId)

    await db
      .delete(likes)
      .where(and(eq(likes.tweet_id, issueId), eq(likes.user_id, userId)));
    revalidatePath("/");
  }
};

export const replyAnIssue = async ({
  tweet_id,
  user_id,
  replyText,
}: {
  tweet_id: string;
  user_id: string;
  replyText: string;
}) => {
  if (replyText === "") return;
  await db.insert(replies).values({
    user_id,
    tweet_id,
    text: replyText,
  });

  revalidatePath("/");
};

export const getAPaticularIssueWithReply = async ({
  userId,
  tweetId,
}: {
  userId: string;
  tweetId: string;
}) => {
  console.log(userId + "server");
  console.log(tweetId + "server");

  try {
    // console.log(userId);
    const res = await db
      .select({
        tweet,
        profiles,
        ...(userId
          ? {
              hasLiked: exists(
                db
                  .select()
                  .from(likes)
                  .where(
                    and(
                      eq(likes.tweet_id, tweet.id),
                      eq(likes.user_id, userId)
                    )
                  )
              ),
            }
          : {}),
        likes,
      })
      .from(tweet)
      .where(eq(tweet.id,tweetId))
      .leftJoin(likes, eq(tweet.id, likes.tweet_id))
      .innerJoin(profiles, eq(tweet.profile_id, profiles.id))
      .orderBy(desc(tweet.created_at));

    const rows = await res;

    if (rows) {
      const result = rows.reduce<
        Record<
          string,
          {
            tweet: Tweet;
            likes: Like[];
            profile: Profile;
            hasLiked: boolean;
            replies: Tweet[];
          }
        >
      >((acc, row) => {
        const tweet = row.tweet;
        const like = row.likes;
        const profile = row.profiles;
        const hasLiked = Boolean(row.hasLiked);
        // const reply = row.tweetsReplies;

        if (!acc[tweet.id]) {
          acc[tweet.id] = {
            tweet,
            likes: [],
            profile,
            hasLiked,
            replies: [],
          };
        }

        if (like) {
          acc[tweet.id].likes.push(like);
          const ids = acc[tweet.id].likes.map(({ id }) => id);
          const filteredLikesArr = acc[tweet.id].likes.filter(
            ({ id }, index) => !ids.includes(id, index + 1)
          );
          acc[tweet.id].likes = filteredLikesArr;
        }

        return acc;
      }, {});

      const data = Object.values(result);
      // console.log(data);
      return {data};
    }
  } catch (error) {
    console.log(error);
    return { error: "something wrong with querying the db" };
  }
};


export const getTweetByLocation = async (userLat: number, userLng: number, currentUserId?: string) => {
  try {
    console.log(`Fetching tweets near: (${userLat}, ${userLng})`);

    const res = await db
      .select({
        tweet,
        profiles,
        ...(currentUserId
          ? {
              hasLiked: exists(
                db
                  .select()
                  .from(likes)
                  .where(
                    and(
                      eq(likes.tweet_id, tweet.id),
                      eq(likes.user_id, currentUserId)
                    )
                  )
              ),
            }
          : {}), 
        likes,
        distance: sql`
          6371 * acos(
            cos(radians(${userLat})) * cos(radians(tweet.latitude)) *
            cos(radians(tweet.longitude) - radians(${userLng})) +
            sin(radians(${userLat})) * sin(radians(tweet.latitude))
          )
        `.as("distance"),
      })
      .from(tweet)
      .leftJoin(likes, eq(tweet.id, likes.tweet_id))
      .innerJoin(profiles, eq(tweet.profile_id, profiles.id))
      .orderBy(sql`distance ASC`); // Sort by closest first

    const rows = await res;

    if (rows) {
      const result = rows.reduce<
        Record<
          string,
          {
            tweet: Tweet;
            likes: Like[];
            profile: Profile;
            hasLiked: boolean;
            replies: Tweet[];
          }
        >
      >((acc, row) => {
        const tweet = row.tweet;
        const like = row.likes;
        const profile = row.profiles;
        const hasLiked = Boolean(row.hasLiked);

        if (!acc[tweet.id]) {
          acc[tweet.id] = {
            tweet,
            likes: [],
            profile,
            hasLiked,
            replies: [],
          };
        }

        if (like) {
          acc[tweet.id].likes.push(like);
          const ids = acc[tweet.id].likes.map(({ id }) => id);
          acc[tweet.id].likes = acc[tweet.id].likes.filter(
            ({ id }, index) => !ids.includes(id, index + 1)
          );
        }

        return acc;
      }, {});

      const data = Object.values(result);
      return { data };
    }
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong while querying location-based tweets." };
  }
};

export const getTweetByCategory = async (category: string, currentUserId?: string)=>{
  
  try {
    const res = await db.select({
      tweet,
      profiles,
      ...(currentUserId ?
        {
          hasLiked: exists(
            db.select().from(likes).where(
              and(
                eq(likes.tweet_id, tweet.id),
                eq(likes.user_id, currentUserId)
              )
            )
          )
        } : {}
      ),
      likes,
    }).from(tweet)
      .leftJoin(likes, eq(tweet.id, likes.tweet_id))
      .innerJoin(profiles, eq(tweet.profile_id, profiles.id))
      .where(eq(tweet.category, category))
      .orderBy(desc(tweet.created_at));
    
    const rows = await res;

    if (rows) {
      const result = rows.reduce<
        Record<
          string,
          {
            tweet: Tweet;
            likes: Like[];
            profile: Profile;
            hasLiked: boolean;
            replies: Tweet[];
          }
        >
        >((acc, row)=> {
          const tweet = row.tweet;
          const like = row.likes;
          const profile = row.profiles;
          const hasLiked = Boolean(row.hasLiked);

          if (!acc[tweet.id]) {
            acc[tweet.id] = {
              tweet,
              likes: [],
              profile,
              hasLiked,
              replies: [],
            };
          }
  
          if (like) {
            acc[tweet.id].likes.push(like);
            const ids = acc[tweet.id].likes.map(({ id }) => id);
            acc[tweet.id].likes = acc[tweet.id].likes.filter(
              ({ id }, index) => !ids.includes(id, index + 1)
            );
          }
  
          return acc;
        }, {});
  
        const data = Object.values(result);
        return { data };
      }
    } catch (error) {
      console.error(error);
      return { error: "Something went wrong while querying category-based tweets." };
    }
  };




