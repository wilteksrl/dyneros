CREATE TABLE `affiliate_agreements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateProfileId` int NOT NULL,
	`agreementVersion` varchar(20) NOT NULL DEFAULT '1.0',
	`acceptedAt` timestamp NOT NULL DEFAULT (now()),
	`ipHash` varchar(64) NOT NULL,
	`documentUrl` varchar(500),
	CONSTRAINT `affiliate_agreements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int,
	`subAffiliateId` int,
	`codeUsed` varchar(30) NOT NULL,
	`landingPage` varchar(500) NOT NULL,
	`refType` enum('affiliate','sub_affiliate') NOT NULL,
	`ipHash` varchar(64) NOT NULL,
	`userAgent` text,
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_conversions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`affiliateId` int,
	`subAffiliateId` int,
	`contractValueNet` decimal(12,2) NOT NULL,
	`serviceCategory` varchar(100) NOT NULL,
	`commissionRate` decimal(5,2) NOT NULL,
	`commissionAmount` decimal(12,2) NOT NULL,
	`parentOverrideRate` decimal(5,2) NOT NULL DEFAULT '50.00',
	`parentOverrideAmount` decimal(12,2),
	`recurrenceType` enum('one_time','monthly','annual') NOT NULL DEFAULT 'one_time',
	`recurrenceMonths` int,
	`status` enum('pending','approved','invoiced','paid','rejected','cancelled') NOT NULL DEFAULT 'pending',
	`convertedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliate_conversions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int,
	`subAffiliateId` int,
	`source` enum('contact_form','manual','crm','api') NOT NULL DEFAULT 'contact_form',
	`fullName` varchar(255) NOT NULL,
	`companyName` varchar(255),
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`serviceCategory` varchar(100),
	`estimatedValue` decimal(12,2),
	`status` enum('new','qualified','proposal','won','lost','invalid') NOT NULL DEFAULT 'new',
	`attributionWindowEndsAt` timestamp NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliate_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateProfileId` int NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'EUR',
	`method` enum('bank','paypal','crypto') NOT NULL,
	`status` enum('pending','processing','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
	`reference` varchar(255),
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`type` enum('affiliate','sub_affiliate') NOT NULL,
	`status` enum('pending','active','suspended','rejected') NOT NULL DEFAULT 'pending',
	`fullName` varchar(255) NOT NULL,
	`companyName` varchar(255),
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`taxId` varchar(50),
	`vatNumber` varchar(50),
	`website` varchar(500),
	`country` varchar(100),
	`promoChannels` text,
	`paymentMethod` enum('bank','paypal','dyn','usdt','usdc','btc','eth') NOT NULL DEFAULT 'bank',
	`iban` varchar(50),
	`walletAddress` varchar(100),
	`affiliateCode` varchar(30) NOT NULL,
	`parentAffiliateId` int,
	`referralUrl` varchar(500),
	`notes` text,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliate_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliate_profiles_email_unique` UNIQUE(`email`),
	CONSTRAINT `affiliate_profiles_affiliateCode_unique` UNIQUE(`affiliateCode`)
);
--> statement-breakpoint
CREATE INDEX `agree_aff_idx` ON `affiliate_agreements` (`affiliateProfileId`);--> statement-breakpoint
CREATE INDEX `click_aff_idx` ON `affiliate_clicks` (`affiliateId`);--> statement-breakpoint
CREATE INDEX `click_sub_idx` ON `affiliate_clicks` (`subAffiliateId`);--> statement-breakpoint
CREATE INDEX `click_code_idx` ON `affiliate_clicks` (`codeUsed`);--> statement-breakpoint
CREATE INDEX `conv_aff_idx` ON `affiliate_conversions` (`affiliateId`);--> statement-breakpoint
CREATE INDEX `conv_sub_idx` ON `affiliate_conversions` (`subAffiliateId`);--> statement-breakpoint
CREATE INDEX `conv_status_idx` ON `affiliate_conversions` (`status`);--> statement-breakpoint
CREATE INDEX `conv_lead_idx` ON `affiliate_conversions` (`leadId`);--> statement-breakpoint
CREATE INDEX `lead_aff_idx` ON `affiliate_leads` (`affiliateId`);--> statement-breakpoint
CREATE INDEX `lead_sub_idx` ON `affiliate_leads` (`subAffiliateId`);--> statement-breakpoint
CREATE INDEX `lead_status_idx` ON `affiliate_leads` (`status`);--> statement-breakpoint
CREATE INDEX `payout_aff_idx` ON `affiliate_payouts` (`affiliateProfileId`);--> statement-breakpoint
CREATE INDEX `payout_status_idx` ON `affiliate_payouts` (`status`);--> statement-breakpoint
CREATE INDEX `aff_email_idx` ON `affiliate_profiles` (`email`);--> statement-breakpoint
CREATE INDEX `aff_code_idx` ON `affiliate_profiles` (`affiliateCode`);--> statement-breakpoint
CREATE INDEX `aff_parent_idx` ON `affiliate_profiles` (`parentAffiliateId`);--> statement-breakpoint
CREATE INDEX `aff_status_idx` ON `affiliate_profiles` (`status`);