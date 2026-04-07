package com.example.StudyFriends.config;

import com.example.StudyFriends.dto.RewardStage;

public class RewardConfig {
    public static final double[] SKILL_BONUS = {1.0, 1.1, 1.25, 1.5};

    public static final double[] FRIENDSHIP_BONUS = new double[] {
            1.0, 1.04, 1.06, 1.08, 1.10, 1.12, 1.14, 1.16, 1.18, 1.20
    };

    public static final int[] SERIES_COINS_AMOUNT = new int[] {0,5,10,10,10,15,15};

    public static final int FRIENDSHIP_EXP_BONUS = 30;
    public static final int SKILL_EXP_BONUS = 30;

    public static final int GACHA_PRICE = 350;
    public static final double CHARACTER_CHANCE = 0.6;

    public static final RewardStage[] SKILL_LEVELS = new RewardStage[] {
            new RewardStage("новичок",60,1,10,0),
            new RewardStage("продолжающий",12*60,11,20,0.1),
            new RewardStage("опытный",24*60,21,30,0.25),
            new RewardStage("мастер",36*60,31,1000,0.5)
    };

    public static final int[] ITEMS_MAX_PRICES = new int[] {10,40,120,500};
    //показывать рекомендуемые цены предметов при добавлении
}
