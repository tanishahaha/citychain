import { relations, sql } from "drizzle-orm";
import { pgTable, serial, timestamp, text, unique, foreignKey, AnyPgColumn, index, uniqueIndex } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey().default(sql`gen_random_uuid()`),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  username: text("username").unique().notNull(),
  full_name: text("full_name"),
  email: text("email"),
});

export const tweet = pgTable("tweet", {
  id: serial("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  profileId: serial("profileId").notNull().references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const hashtags = pgTable("hashtags", {
  id: serial("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
});

export const tweet_hashtag = pgTable("tweet_hashtag", {
    tweet_id: serial("tweet_id").references(() => tweet.id),
    hashtag_id: serial("hashtag_id").references(() => hashtags.id),
  }, (tweet_hashtag) => ({
    // Define the primary key on 'tweet_id' and 'hashtag_id' (composite key)
    primaryKey: [tweet_hashtag.tweet_id, tweet_hashtag.hashtag_id], // Array of columns
  }));

export const replies = pgTable("replies", {
  id: serial("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  user_id: serial("user_id").notNull().references(()=> profiles.id),
  tweet_id: serial("tweet_id").notNull().references(()=>tweet.id),
  reply_id: serial("reply_id").notNull().references(():AnyPgColumn=>replies.id),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: serial("user_id").notNull().references(()=> profiles.id),
  tweet_id: serial("tweet_id").notNull().references(()=>tweet.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
},
(table) => ({
  likesUniqueIndex: uniqueIndex('likesUniqueIndex').on(table.user_id,table.tweet_id),
}),
);




export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: serial("user_id").notNull().references(()=> profiles.id),
  tweet_id: serial("tweet_id").notNull().references(()=>tweet.id),
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
    fields:[tweet.profileId],
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




// index('bookmarkUniqueIndex')
//   .on(bookmarks.user_id, bookmarks.tweet_id);
