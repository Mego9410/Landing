CREATE TABLE IF NOT EXISTS "email_prefs" (
	"user_id" text PRIMARY KEY NOT NULL REFERENCES "public"."user"("id") ON DELETE cascade,
	"weekly_recap" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recap_sent" (
	"user_id" text NOT NULL REFERENCES "public"."user"("id") ON DELETE cascade,
	"week" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recap_sent_user_id_week_pk" PRIMARY KEY("user_id","week")
);
