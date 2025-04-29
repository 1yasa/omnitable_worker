CREATE TABLE `mining` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`period` integer,
	`farm` text NOT NULL,
	`pool` text NOT NULL,
	`earning` integer DEFAULT 0,
	`hashrate` real DEFAULT 0,
	`create_at` integer,
	`update_at` integer
);
--> statement-breakpoint
CREATE INDEX `period` ON `mining` (`period`);--> statement-breakpoint
CREATE INDEX `farm` ON `mining` (`farm`);--> statement-breakpoint
CREATE INDEX `pool` ON `mining` (`pool`);