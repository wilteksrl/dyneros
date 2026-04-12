CREATE TABLE IF NOT EXISTS `ai_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('active','training','paused','archived') NOT NULL DEFAULT 'active',
	`environment` enum('dev','staging','production') NOT NULL DEFAULT 'dev',
	`accuracy` decimal(5,2),
	`latency` int,
	`monthlyCost` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `api_keys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`keyHash` varchar(64) NOT NULL,
	`keyPrefix` varchar(12) NOT NULL,
	`scopes` varchar(500) NOT NULL DEFAULT 'read',
	`lastUsedAt` timestamp,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_keys_id` PRIMARY KEY(`id`),
	CONSTRAINT `api_keys_keyHash_unique` UNIQUE(`keyHash`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`resource` varchar(100),
	`resourceId` varchar(50),
	`changes` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contractName` varchar(255) NOT NULL,
	`type` enum('NDA','Service Agreement','Statement of Work','Other') NOT NULL DEFAULT 'Other',
	`status` enum('draft','active','signed','expired') NOT NULL DEFAULT 'draft',
	`startDate` timestamp,
	`endDate` timestamp,
	`signedAt` timestamp,
	`documentUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('contract','sow','nda','technical','report','other') DEFAULT 'other',
	`category` varchar(100) NOT NULL DEFAULT 'general',
	`fileUrl` varchar(500) NOT NULL,
	`fileSize` int,
	`status` enum('draft','approved','signed','final','archived') NOT NULL DEFAULT 'draft',
	`uploadedBy` int NOT NULL,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `domains` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`domainName` varchar(255) NOT NULL,
	`registrar` varchar(100),
	`status` enum('active','expiring_soon','expired') NOT NULL DEFAULT 'active',
	`expiryDate` timestamp,
	`sslStatus` enum('valid','expiring_soon','expired') NOT NULL DEFAULT 'valid',
	`sslExpiryDate` timestamp,
	`dnsRecords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `domains_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`invoiceNumber` varchar(50) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'EUR',
	`status` enum('paid','unpaid','overdue') NOT NULL DEFAULT 'unpaid',
	`issued` timestamp NOT NULL,
	`due` timestamp NOT NULL,
	`description` text,
	`pdfUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('ticket_update','invoice','milestone','deployment','alert','system') NOT NULL DEFAULT 'system',
	`title` varchar(255) NOT NULL,
	`message` text,
	`read` boolean NOT NULL DEFAULT false,
	`actionUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` enum('blockchain_infrastructure','smart_contract','web_app','ai_system','other') NOT NULL DEFAULT 'other',
	`status` enum('planning','in_progress','completed','on_hold') NOT NULL DEFAULT 'planning',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`startDate` timestamp,
	`eta` timestamp,
	`progress` int DEFAULT 0,
	`environment` enum('dev','staging','production') NOT NULL DEFAULT 'dev',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `smart_contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` varchar(42) NOT NULL,
	`network` varchar(50) NOT NULL DEFAULT 'DYNEROS Chain',
	`status` enum('active','inactive','deprecated') NOT NULL DEFAULT 'active',
	`verified` boolean NOT NULL DEFAULT false,
	`abi` text,
	`sourceCode` text,
	`deployDate` timestamp,
	`owner` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `smart_contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ticket_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`attachments` varchar(1000),
	`isStaff` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticket_replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int,
	`ticketNumber` varchar(50) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL DEFAULT 'general',
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','waiting_for_client','resolved','closed') NOT NULL DEFAULT 'open',
	`slaHours` int DEFAULT 24,
	`assignedTo` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `tickets_ticketNumber_unique` UNIQUE(`ticketNumber`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`language` enum('it','en') NOT NULL DEFAULT 'it',
	`theme` enum('dark','light') NOT NULL DEFAULT 'dark',
	`notificationsEmail` boolean NOT NULL DEFAULT true,
	`notificationsTickets` boolean NOT NULL DEFAULT true,
	`notificationsInvoices` boolean NOT NULL DEFAULT true,
	`notificationsMilestones` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`address` varchar(42) NOT NULL,
	`name` varchar(100),
	`network` varchar(50) NOT NULL DEFAULT 'DYNEROS Chain',
	`privateKeyEncrypted` text,
	`balance` decimal(30,18) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_address_unique` UNIQUE(`address`)
);
--> statement-breakpoint
CREATE INDEX `ai_user_idx` ON `ai_projects` (`userId`);--> statement-breakpoint
CREATE INDEX `apikeys_user_idx` ON `api_keys` (`userId`);--> statement-breakpoint
CREATE INDEX `audit_user_idx` ON `audit_log` (`userId`);--> statement-breakpoint
CREATE INDEX `audit_action_idx` ON `audit_log` (`action`);--> statement-breakpoint
CREATE INDEX `contracts_user_idx` ON `contracts` (`userId`);--> statement-breakpoint
CREATE INDEX `documents_user_idx` ON `documents` (`userId`);--> statement-breakpoint
CREATE INDEX `domains_user_idx` ON `domains` (`userId`);--> statement-breakpoint
CREATE INDEX `invoices_user_idx` ON `invoices` (`userId`);--> statement-breakpoint
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `notif_user_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `notif_read_idx` ON `notifications` (`read`);--> statement-breakpoint
CREATE INDEX `projects_user_idx` ON `projects` (`userId`);--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);--> statement-breakpoint
CREATE INDEX `sc_user_idx` ON `smart_contracts` (`userId`);--> statement-breakpoint
CREATE INDEX `replies_ticket_idx` ON `ticket_replies` (`ticketId`);--> statement-breakpoint
CREATE INDEX `tickets_user_idx` ON `tickets` (`userId`);--> statement-breakpoint
CREATE INDEX `tickets_status_idx` ON `tickets` (`status`);--> statement-breakpoint
CREATE INDEX `wallets_user_idx` ON `wallets` (`userId`);