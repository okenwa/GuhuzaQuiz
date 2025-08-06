-- DropForeignKey
ALTER TABLE `rewardclaim` DROP FOREIGN KEY `RewardClaim_Milestone_Id_fkey`;

-- AlterTable
ALTER TABLE `player` ADD COLUMN `invitesCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `lastInviteAt` DATETIME(3) NULL,
    ADD COLUMN `lastShareAt` DATETIME(3) NULL,
    ADD COLUMN `sharesCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `rewardclaim` MODIFY `Milestone_Id` INTEGER NULL;

-- CreateTable
CREATE TABLE `SocialShare` (
    `Share_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Player_ID` INTEGER NOT NULL,
    `Platform` VARCHAR(191) NOT NULL,
    `Share_Content` VARCHAR(191) NOT NULL,
    `Share_Url` VARCHAR(191) NULL,
    `Shared_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Points_Earned` INTEGER NOT NULL DEFAULT 0,

    INDEX `SocialShare_Player_ID_idx`(`Player_ID`),
    INDEX `SocialShare_Platform_idx`(`Platform`),
    INDEX `SocialShare_Shared_At_idx`(`Shared_At`),
    PRIMARY KEY (`Share_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FriendInvite` (
    `Invite_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Player_ID` INTEGER NOT NULL,
    `Invitee_Email` VARCHAR(191) NOT NULL,
    `Invitee_Name` VARCHAR(191) NULL,
    `Referral_Code` VARCHAR(191) NOT NULL,
    `Invited_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Accepted_At` DATETIME(3) NULL,
    `Accepted_By` INTEGER NULL,
    `Points_Earned` INTEGER NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'pending',

    INDEX `FriendInvite_Player_ID_idx`(`Player_ID`),
    INDEX `FriendInvite_Invitee_Email_idx`(`Invitee_Email`),
    INDEX `FriendInvite_Referral_Code_idx`(`Referral_Code`),
    INDEX `FriendInvite_Status_idx`(`Status`),
    INDEX `FriendInvite_Invited_At_idx`(`Invited_At`),
    PRIMARY KEY (`Invite_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RewardClaim` ADD CONSTRAINT `RewardClaim_Milestone_Id_fkey` FOREIGN KEY (`Milestone_Id`) REFERENCES `milestone`(`Milestone_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocialShare` ADD CONSTRAINT `SocialShare_Player_ID_fkey` FOREIGN KEY (`Player_ID`) REFERENCES `player`(`Player_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FriendInvite` ADD CONSTRAINT `FriendInvite_Player_ID_fkey` FOREIGN KEY (`Player_ID`) REFERENCES `player`(`Player_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
