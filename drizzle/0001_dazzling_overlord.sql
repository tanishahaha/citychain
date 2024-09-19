ALTER TABLE "tweet" RENAME COLUMN "profile_id" TO "profileId";--> statement-breakpoint
ALTER TABLE "tweet" DROP CONSTRAINT "tweet_profile_id_profiles_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tweet" ADD CONSTRAINT "tweet_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
