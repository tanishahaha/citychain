ALTER TABLE "replies" ALTER COLUMN "reply_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tweet" ADD COLUMN "images" text[] DEFAULT ARRAY[]::text[];