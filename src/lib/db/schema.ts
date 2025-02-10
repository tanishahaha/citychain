import { InferModel, InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTable, uuid, timestamp, text, unique, foreignKey, AnyPgColumn, index, uniqueIndex, real } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  username: text("username").unique().notNull(),
  full_name: text("full_name"),
  email: text("email"),
  latitude: real("latitude"),
  longitude:real("longitude")
});

export const tweet = pgTable("tweet", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  profile_id: uuid("profile_id").notNull().references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  category: text("category").notNull().default(""),
  issuesImages: text("images").array().default(sql`ARRAY[]::text[]`),
  latitude: real("latitude"),
  longitude: real("longitude"),
  location_name: text("location_name"),
  title:text("title")

});

export type Tweet= InferSelectModel<typeof tweet>;
export type Profile= InferSelectModel<typeof profiles>;
export type Like = InferSelectModel<typeof likes>;

export const hashtags = pgTable("hashtags", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
});

export const tweet_hashtag = pgTable("tweet_hashtag", {
    tweet_id: uuid("tweet_id").references(() => tweet.id),
    hashtag_id: uuid("hashtag_id").references(() => hashtags.id),
  }, (tweet_hashtag) => ({
    // Define the primary key on 'tweet_id' and 'hashtag_id' (composite key)
    primaryKey: [tweet_hashtag.tweet_id, tweet_hashtag.hashtag_id], // Array of columns
  }));

export const replies = pgTable("replies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  user_id: uuid("user_id").notNull().references(()=> profiles.id),
  tweet_id: uuid("tweet_id").notNull().references(()=>tweet.id),
  reply_id: uuid("reply_id").references(():AnyPgColumn=>replies.id),
});

export const likes = pgTable("likes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().references(()=> profiles.id),
  tweet_id: uuid("tweet_id").notNull().references(()=>tweet.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
},
(table) => ({
  likesUniqueIndex: uniqueIndex('likesUniqueIndex').on(table.user_id,table.tweet_id),
}),
);





export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().references(()=> profiles.id),
  tweet_id: uuid("tweet_id").notNull().references(()=>tweet.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
},
(table) => ({
  bookmarksUniqueIndex: uniqueIndex('bookmarksUniqueIndex').on(table.user_id,table.tweet_id),
}),
);

export const profilesRelations= relations(profiles, ({one,many}) =>({
  tweet:many(tweet),
  likes:many(likes),
  bookmarks:many(bookmarks),
  replies:many(replies)
}))

export const tweetRelations= relations(tweet, ({one,many}) =>({
  profiles:one(profiles, {
    fields:[tweet.profile_id],
    references:[profiles.id],
  })
}))

export const repliesRelations= relations(replies, ({one,many}) =>({
  profiles:one(profiles, {
    fields:[replies.user_id],
    references:[profiles.id],
  })
}))

export const likesRelations= relations(likes, ({one,many}) =>({
  profiles:one(profiles, {
    fields:[likes.user_id],
    references:[profiles.id],
  })
}))

export const bookmarksRelations= relations(bookmarks, ({one,many}) =>({
  profiles:one(profiles, {
    fields:[bookmarks.user_id],
    references:[profiles.id],
  })
}))

// export const insertProfileFromUser = sql`
// CREATE OR REPLACE FUNCTION public.insert_profile_from_user()
// RETURNS trigger AS $$
// BEGIN
//   INSERT INTO public.profiles (id, username, email, full_name)
//   VALUES (NEW.id, jsonb_extract_path_text(NEW.raw_user_meta_data, 'username'), jsonb_extract_path_text(NEW.raw_user_meta_data, 'email'), jsonb_extract_path_text(NEW.raw_user_meta_data, 'full_name'));
//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;
// `;

// export const triggerOnUserInsert = sql`
// CREATE TRIGGER insert_profile_after_user_insert
// AFTER INSERT ON auth.users
// FOR EACH ROW
// EXECUTE PROCEDURE public.insert_profile_from_user();
// `;



// index('bookmarkUniqueIndex')
//   .on(bookmarks.user_id, bookmarks.tweet_id);
