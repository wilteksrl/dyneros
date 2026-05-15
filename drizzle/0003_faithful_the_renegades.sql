CREATE TABLE `email_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sentBy` int,
	`toEmail` varchar(320) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`body` text NOT NULL,
	`status` enum('sent','failed') NOT NULL DEFAULT 'sent',
	`errorMessage` text,
	`isBulk` boolean NOT NULL DEFAULT false,
	`recipientCount` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `email_log_sentby_idx` ON `email_log` (`sentBy`);--> statement-breakpoint
CREATE INDEX `email_log_created_idx` ON `email_log` (`createdAt`);