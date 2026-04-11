package com.example.StudyFriends.dto.reward;

import com.example.StudyFriends.config.RewardConfig;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FriendReward {
    private int friendshipNewLvl;
    private double friendshipExpOfLvl;
    private double friendXpToNext;

    public static FriendReward distributeExp(int level, double totalExp) {
        double currentExp = totalExp;
        double xpToNext = 0;

        while (true) {
            xpToNext = RewardConfig.FRIENDSHIP_LVLS.get(level).getTotalExpForLvl();

            if (currentExp >= xpToNext) {
                currentExp -= xpToNext;
                level++;
            } else break;
        }
        return new FriendReward(level,currentExp,xpToNext);
    }
}
