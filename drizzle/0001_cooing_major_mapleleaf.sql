CREATE TABLE IF NOT EXISTS "payment" (
	"id" serial NOT NULL,
	"order_id" varchar,
	"status" varchar DEFAULT 'pending',
	"user_id" integer,
	"ref_id" integer,
	"method" varchar,
	"credits" integer,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "userss" ADD COLUMN "credits" varchar DEFAULT '10';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_userss_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userss"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
