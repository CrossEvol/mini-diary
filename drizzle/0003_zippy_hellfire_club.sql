CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`text` text,
	`status` text,
	`deadline` integer,
	`created_at` integer,
	`updated_at` integer,
	`priority` text,
	`created_by` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
