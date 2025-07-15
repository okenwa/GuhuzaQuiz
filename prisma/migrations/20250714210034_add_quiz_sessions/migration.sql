-- CreateTable
CREATE TABLE `quizSession` (
    `Session_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Player_ID` INTEGER NOT NULL,
    `Level_Id` INTEGER NOT NULL,
    `Current_Question` INTEGER NOT NULL DEFAULT 0,
    `Score` INTEGER NOT NULL DEFAULT 0,
    `Total_Questions` INTEGER NOT NULL,
    `Completed` BOOLEAN NOT NULL DEFAULT false,
    `Started_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Last_Activity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Time_Spent` INTEGER NOT NULL DEFAULT 0,
    `Correct_Answers` INTEGER NOT NULL DEFAULT 0,
    `Wrong_Answers` INTEGER NOT NULL DEFAULT 0,
    `Streak` INTEGER NOT NULL DEFAULT 0,
    `Used_Hints` INTEGER NOT NULL DEFAULT 0,
    `Retry_Count` INTEGER NOT NULL DEFAULT 0,

    INDEX `quizSession_Player_ID_idx`(`Player_ID`),
    INDEX `quizSession_Level_Id_idx`(`Level_Id`),
    UNIQUE INDEX `quizSession_Player_ID_Level_Id_key`(`Player_ID`, `Level_Id`),
    PRIMARY KEY (`Session_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionProgress` (
    `Progress_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Session_ID` INTEGER NOT NULL,
    `Question_Index` INTEGER NOT NULL,
    `Selected_Answer` INTEGER NULL,
    `Is_Correct` BOOLEAN NULL,
    `Time_Taken` INTEGER NULL,
    `Used_Hint` BOOLEAN NOT NULL DEFAULT false,
    `Retry_Count` INTEGER NOT NULL DEFAULT 0,
    `Answer_Checked` BOOLEAN NOT NULL DEFAULT false,

    INDEX `QuestionProgress_Session_ID_idx`(`Session_ID`),
    UNIQUE INDEX `QuestionProgress_Session_ID_Question_Index_key`(`Session_ID`, `Question_Index`),
    PRIMARY KEY (`Progress_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quizSession` ADD CONSTRAINT `quizSession_Player_ID_fkey` FOREIGN KEY (`Player_ID`) REFERENCES `player`(`Player_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quizSession` ADD CONSTRAINT `quizSession_Level_Id_fkey` FOREIGN KEY (`Level_Id`) REFERENCES `level`(`Level_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionProgress` ADD CONSTRAINT `QuestionProgress_Session_ID_fkey` FOREIGN KEY (`Session_ID`) REFERENCES `quizSession`(`Session_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
