CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nominees" (
	"id" uuid PRIMARY KEY NOT NULL,
	"season_id" integer NOT NULL,
	"company" text NOT NULL,
	"headline" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"sources" jsonb NOT NULL,
	"status" text DEFAULT 'visible' NOT NULL,
	"duplicate_of" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nominee_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"resolved" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results" (
	"season_id" integer PRIMARY KEY NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" integer PRIMARY KEY NOT NULL,
	"closes_at" timestamp with time zone NOT NULL,
	"finalized_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "voters" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"nominee_id" uuid NOT NULL,
	"voter_id" uuid NOT NULL,
	CONSTRAINT "votes_nominee_id_voter_id_pk" PRIMARY KEY("nominee_id","voter_id")
);
--> statement-breakpoint
ALTER TABLE "nominees" ADD CONSTRAINT "nominees_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_nominee_id_nominees_id_fk" FOREIGN KEY ("nominee_id") REFERENCES "public"."nominees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_nominee_id_nominees_id_fk" FOREIGN KEY ("nominee_id") REFERENCES "public"."nominees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_id_voters_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."voters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "nominees_season_idx" ON "nominees" USING btree ("season_id");