package com.example.StudyFriends.dto.reward;

import com.example.StudyFriends.config.RewardConfig;

/**
 * @param xpPerLevel сколько XP нужно на 1 уровень
 */
public record SkillStageData(String name, int xpPerLevel, int minLevel, int maxLevel, double coinBonus) {
    public boolean isInStage(int level) {
        return level >= minLevel && level <= maxLevel;
    }

    public static SkillStageData getSkillStageByLevel(int level) {
        for (SkillStageData stage : RewardConfig.SKILL_STAGES) {
            if (stage.isInStage(level)) {
                return stage;
            }
        }
        throw new IllegalStateException("No stage for level: " + level);
    }


}
