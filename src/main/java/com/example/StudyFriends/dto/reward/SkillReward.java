package com.example.StudyFriends.dto.reward;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SkillReward {
    private String skillName;
    private int skillNewLvl;
    private double skillExpOfLvl;
    private double skillXpToNext;
    private String XP;

    public static SkillReward distributeExp(String name,int level, double totalExp) {
        double currentExp = totalExp;
        double xpToNext = 0;

        StringBuilder xp = new StringBuilder(" МАКС УРОВЕНЬ, ");
        while (true) {
            xpToNext = SkillStageData.getSkillStageByLevel(level).xpPerLevel();
            xp.append("МАКС УР |"+ xpToNext + " ");
            if (currentExp >= xpToNext) {
                currentExp -= xpToNext;
                level++;
                xp.append(currentExp + " ").append(level + " | ");
            } else break;
        }

        return new SkillReward(name,level,currentExp,xpToNext, xp.toString());
    }
}
