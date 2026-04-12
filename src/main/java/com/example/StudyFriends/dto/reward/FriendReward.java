package com.example.StudyFriends.dto.reward;

import com.example.StudyFriends.config.RewardConfig;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
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
            FriendshipData data = RewardConfig.FRIENDSHIP_LVLS.get(level);
            if (data == null && level >=10) {
                double maxXp = RewardConfig.FRIENDSHIP_LVLS.get(10).getTotalExpForLvl();
                return new FriendReward(10,maxXp,maxXp);
            }
            else if(data==null) {
                throw new ResourceNotFoundException("Не зняю");
            }
            xpToNext = data.getTotalExpForLvl();

            if (currentExp >= xpToNext) {
                currentExp -= xpToNext;
                level++;
            } else break;
        }

        return new FriendReward(level,currentExp,xpToNext);
    }
}
