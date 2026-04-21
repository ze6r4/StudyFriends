package com.example.StudyFriends.dto.reward;

import lombok.Data;

@Data
public class SessionReward {
    private SkillReward skillReward;

    private FriendReward friendReward;

    private double skillCoinBonus;
    private double friendCoinBonus;

    private int coinsFromSkill;
    private int coinsFromFriendship;
    private int coinsFromSession;

    private int totalMinutes;
}
