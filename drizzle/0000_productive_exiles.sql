CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"keyword" jsonb,
	"is_deleted" boolean DEFAULT false,
	"is_favorite" boolean DEFAULT false,
	"created_at" timestamp DEFAULT NOW(),
	"updated_at" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userss" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(10) NOT NULL,
	"password" varchar(255) NOT NULL,
	"refresh_token" text,
	"created_at" timestamp DEFAULT NOW(),
	"updated_at" timestamp DEFAULT NOW(),
	CONSTRAINT "userss_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_userss_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userss"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
