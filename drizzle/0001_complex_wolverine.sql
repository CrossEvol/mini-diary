CREATE TABLE `diaries` (
	`id` integer PRIMARY KEY NOT NULL,
	`owner_id` integer NOT NULL,
	`content` blob,
	`created_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `full_name` TO `nickname`;--> statement-breakpoint
ALTER TABLE users ADD `password` text;--> statement-breakpoint
ALTER TABLE users ADD `pin_code` text;