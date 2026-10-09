ALTER TABLE `game_saves` ADD `active_session` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `game_saves` ADD `last_write` text DEFAULT '' NOT NULL;