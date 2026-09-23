ALTER TABLE "nominees" ADD COLUMN "before_state" text;--> statement-breakpoint
ALTER TABLE "nominees" ADD COLUMN "after_state" text;--> statement-breakpoint
ALTER TABLE "nominees" ADD COLUMN "impact" text;--> statement-breakpoint
ALTER TABLE "nominees" ADD COLUMN "changed_at" date;--> statement-breakpoint
ALTER TABLE "nominees" ADD COLUMN "sector" text;--> statement-breakpoint
ALTER TABLE "nominees" ADD COLUMN "outcome" text DEFAULT 'ongoing' NOT NULL;--> statement-breakpoint
ALTER TABLE "nominees" ADD COLUMN "verified" integer DEFAULT 0 NOT NULL;