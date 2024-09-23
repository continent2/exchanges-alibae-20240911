CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roleNameKey` (`name`)
);

-- MariaDB [alibae]> select * from wallet where id like '89c%' \G
-- *************************** 1. row ***************************
--        id: 89c30e7a-b743-4304-8d68-e8e0f303521e
--    userId: 8febbd91-84c5-4f60-a44b-5aea1e19a38a
--      type: SPOT
--  currency: USDT
--   balance: 0
--   inOrder: 0
--    status: 1
-- createdAt: 2024-09-06 03:15:57
-- updatedAt: 2024-09-06 03:37:29
-- deletedAt: NULL
--   address: NULL
-- 1 row in set (0.000 sec)

CREATE TABLE `wallet` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` enum('FIAT','SPOT','ECO','FUTURES') NOT NULL,
  `currency` varchar(255) NOT NULL,
  `balance` double NOT NULL DEFAULT 0,
  `inOrder` double DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`address`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `walletIdKey` (`id`) USING BTREE,
  UNIQUE KEY `walletUserIdCurrencyTypeKey` (`userId`,`currency`,`type`) USING BTREE,
  CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

INSERT INTO `role` VALUES (2,'Admin'),
(1,'Super Admin'),(3,'Support'),(4,'User');
 CREATE TABLE `user` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(1000) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `emailVerified` tinyint(1) NOT NULL DEFAULT 0,
  `phone` varchar(255) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  `profile` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`profile`)),
  `lastLogin` datetime DEFAULT NULL,
  `lastFailedLogin` datetime DEFAULT NULL,
  `failedLoginAttempts` int(11) DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','BANNED') DEFAULT 'ACTIVE',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `email` (`email`),
  KEY `UserRoleIdFkey` (`roleId`) USING BTREE,
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
