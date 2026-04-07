package com.example.StudyFriends.dto;

import com.example.StudyFriends.config.RewardConfig;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RewardStage {
    private final String name;
    // сколько XP нужно на 1 уровень
    private final int xpPerLevel;
    private final int minLevel;
    private final int maxLevel;
    private final double bonus;

    public boolean isInStage(int level) {
        return level >= minLevel && level <= maxLevel;
    }
    public static RewardStage getSkillStageByLevel(int level) {
        for (RewardStage stage : RewardConfig.SKILL_LEVELS) {
            if (stage.isInStage(level)) {
                return stage;
            }
        }
        throw new IllegalStateException("No stage for level: " + level);
    }



}
