package com.example.StudyFriends.services;

import com.example.StudyFriends.dto.ProgressResult;
import com.example.StudyFriends.dto.RewardStage;
import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.model.Skill;

public class RewardService {

    public RewardService(SessionDto sessionDto) {

    }

    static int totalSessionMinutes(SessionDto sessionDto) {
        int W = sessionDto.getWorkMinutes();
        int R = sessionDto.getRestMinutes();
        int C = sessionDto.getCycles();
        return (W+R)*C;
    }

    public static ProgressResult calculateSkillProgress(Skill skill, SessionDto sessionDto) {

        int level = skill.getLevel();
        int totalXp = skill.getExpAmount() + totalSessionMinutes(sessionDto);

        int gainedLevels = 0;

        while (true) {
            int xpToNext = RewardStage.getSkillStageByLevel(level).getXpPerLevel();

            if (totalXp >= xpToNext) {
                totalXp -= xpToNext;
                level++;
                gainedLevels++;
            } else break;
        }

        return new ProgressResult(level, totalXp, gainedLevels);

    }


}
