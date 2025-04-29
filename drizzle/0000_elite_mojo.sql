CREATE TABLE `mining` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`period` integer,
	`farm` text NOT NULL,
	`pool` text NOT NULL,
	`earning` real DEFAULT 0,
	`hashrate` real DEFAULT 0,
	`create_at` integer,
	`update_at` integer
);
--> statement-breakpoint
CREATE INDEX `period` ON `mining` (`period`);--> statement-breakpoint
CREATE INDEX `farm` ON `mining` (`farm`);--> statement-breakpoint
CREATE INDEX `pool` ON `mining` (`pool`);--> statement-breakpoint
CREATE TABLE `task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`status` integer DEFAULT 0,
	`priority` integer DEFAULT 0,
	`estimated_hours` integer DEFAULT 3,
	`deadline_time` integer,
	`labels` text DEFAULT '[]',
	`miner` text,
	`create_at` integer,
	`update_at` integer
);
--> statement-breakpoint
CREATE INDEX `deadline_time` ON `task` (`deadline_time`);--> statement-breakpoint
CREATE INDEX `create_at` ON `task` (`create_at`);--> statement-breakpoint
CREATE INDEX `update_at` ON `task` (`update_at`);