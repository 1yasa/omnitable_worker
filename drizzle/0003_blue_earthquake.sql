PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mining` (
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
INSERT INTO `__new_mining`("id", "period", "farm", "pool", "earning", "hashrate", "create_at", "update_at") SELECT "id", "period", "farm", "pool", "earning", "hashrate", "create_at", "update_at" FROM `mining`;--> statement-breakpoint
DROP TABLE `mining`;--> statement-breakpoint
ALTER TABLE `__new_mining` RENAME TO `mining`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `period` ON `mining` (`period`);--> statement-breakpoint
CREATE INDEX `farm` ON `mining` (`farm`);--> statement-breakpoint
CREATE INDEX `pool` ON `mining` (`pool`);