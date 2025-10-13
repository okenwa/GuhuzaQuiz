-- Add JobMatchSession table manually
-- Run this SQL directly in your MySQL database

CREATE TABLE IF NOT EXISTS JobMatchSession (
  Session_ID      INT PRIMARY KEY AUTO_INCREMENT,
  Player_ID       INT NOT NULL,
  Resume_Text     TEXT NOT NULL,
  Preferences     TEXT,
  Match_Results   TEXT NOT NULL,
  Created_At      DATETIME DEFAULT CURRENT_TIMESTAMP,
  Updated_At      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (Player_ID) REFERENCES player(Player_ID) ON DELETE CASCADE,
  INDEX idx_jobmatch_player (Player_ID),
  INDEX idx_jobmatch_created (Created_At)
);
