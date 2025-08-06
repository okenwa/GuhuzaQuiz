-- CreateTable
CREATE TABLE `RewardClaim` (
    `Claim_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Player_ID` INTEGER NOT NULL,
    `Milestone_Id` INTEGER NOT NULL,
    `Points_Awarded` INTEGER NOT NULL,
    `Claimed_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Reward_Type` VARCHAR(191) NOT NULL DEFAULT 'milestone',
    `Reward_Data` VARCHAR(191) NULL,

    INDEX `RewardClaim_Player_ID_idx`(`Player_ID`),
    INDEX `RewardClaim_Milestone_Id_idx`(`Milestone_Id`),
    INDEX `RewardClaim_Claimed_At_idx`(`Claimed_At`),
    PRIMARY KEY (`Claim_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RewardClaim` ADD CONSTRAINT `RewardClaim_Player_ID_fkey` FOREIGN KEY (`Player_ID`) REFERENCES `player`(`Player_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RewardClaim` ADD CONSTRAINT `RewardClaim_Milestone_Id_fkey` FOREIGN KEY (`Milestone_Id`) REFERENCES `milestone`(`Milestone_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
