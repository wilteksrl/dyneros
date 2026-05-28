CREATE TABLE `payment_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider` enum('stripe','paypal','bank_transfer') NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`publicKey` varchar(500),
	`secretKey` varchar(500),
	`webhookSecret` varchar(500),
	`clientId` varchar(500),
	`clientSecret` varchar(500),
	`bankName` varchar(200),
	`bankIban` varchar(50),
	`bankSwift` varchar(20),
	`bankAccountHolder` varchar(200),
	`bankReference` varchar(200),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_settings_provider_unique` UNIQUE(`provider`)
);
