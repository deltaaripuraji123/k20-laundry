-- CreateTable
CREATE TABLE `StoreSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `name` VARCHAR(191) NOT NULL DEFAULT 'Star Laundry',
    `address` VARCHAR(191) NOT NULL DEFAULT 'Jl. Sudirman No. 123',
    `phone` VARCHAR(191) NOT NULL DEFAULT '081234567890',
    `email` VARCHAR(191) NOT NULL DEFAULT 'contact@starlaundry.id',
    `website` VARCHAR(191) NULL,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
