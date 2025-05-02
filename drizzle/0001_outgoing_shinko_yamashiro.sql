CREATE TABLE `log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` integer NOT NULL,
	`method` text NOT NULL,
	`host` text NOT NULL,
	`pathname` text NOT NULL,
	`latency` integer NOT NULL,
	`region_short` text NOT NULL,
	`region_full` text NOT NULL,
	`create_at` integer
);
--> statement-breakpoint
CREATE INDEX `log_create_at` ON `log` (`create_at`);