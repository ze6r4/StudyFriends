package com.example.StudyFriends.services;

import com.example.StudyFriends.config.RewardConfig;
import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.dto.reward.FriendReward;
import com.example.StudyFriends.dto.reward.SessionReward;
import com.example.StudyFriends.dto.reward.SkillReward;
import com.example.StudyFriends.dto.reward.SkillStageData;
import org.springframework.stereotype.Service;

@Service
public class RewardService {
    public static int totalSessionMinutes(SessionDto sessionDto) {
        int W = sessionDto.getWorkMinutes();
        int R = sessionDto.getRestMinutes();
        int C = sessionDto.getCycles();
        return (W+R)*C;
    }
    private int calculateCoins(int totalMinutes) {
        return totalMinutes/2;
    }
    private double skillExp(int totalMinutes) {
        return totalMinutes;
    }
    private double friendExp(int totalMinutes) {
        return totalMinutes * 0.5;
    }

    public SessionReward calculateRewards(SessionDto sessionDto, int skillLvl,double oldSkillExp, int friendshipLvl,double oldFriendExp) {
        int totalMinutes = totalSessionMinutes(sessionDto);

        SessionReward rewards = new SessionReward();

        SkillReward skillReward = SkillReward.distributeExp(skillLvl,oldSkillExp+skillExp(totalMinutes));
        FriendReward friendReward = FriendReward.distributeExp(friendshipLvl,oldFriendExp+friendExp(totalMinutes));

        skillLvl = skillReward.getSkillNewLvl();
        friendshipLvl = friendReward.getFriendshipNewLvl();

        rewards.setSkillReward(skillReward);
        rewards.setFriendReward(friendReward);

        int coinsFromSession = calculateCoins(totalMinutes);
        rewards.setCoinsFromSession(coinsFromSession);

        double skillCoinBonus = SkillStageData.getSkillStageByLevel(skillLvl).coinBonus();
        rewards.setSkillCoinBonus(skillCoinBonus);
        rewards.setCoinsFromSkill((int) Math.round(skillCoinBonus * coinsFromSession));

        double friendshipCoinsBonus = RewardConfig.FRIENDSHIP_LVLS.get(friendshipLvl).getCoinsBonus();
        rewards.setFriendCoinBonus(friendshipCoinsBonus);
        rewards.setCoinsFromFriendship((int) Math.round( friendshipCoinsBonus * coinsFromSession));

        return rewards;

    }



}
