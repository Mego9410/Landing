CREATE TABLE IF NOT EXISTS "events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"install_id" text NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"props" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_consent" (
	"user_id" text PRIMARY KEY NOT NULL REFERENCES "public"."user"("id") ON DELETE cascade,
	"version" text NOT NULL,
	"given_at" timestamp with time zone NOT NULL,
	"withdrawn_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lapse_feedback" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"install_id" text NOT NULL,
	"user_id" text,
	"reason" text NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_name_created_idx" ON "events" USING btree ("name","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_install_idx" ON "events" USING btree ("install_id");
