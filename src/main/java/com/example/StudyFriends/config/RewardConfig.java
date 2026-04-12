package com.example.StudyFriends.config;

import com.example.StudyFriends.dto.reward.FriendshipData;
import com.example.StudyFriends.dto.reward.SkillStageData;

import java.util.Map;

public class RewardConfig {

    public static final int[] SERIES_COINS_AMOUNT = new int[] {0,5,10,10,10,15,15};

//    public static final int FRIENDSHIP_EXP_BONUS = 30;
//    public static final int SKILL_EXP_BONUS = 30; TODO: для ежедневных заданий

    public static final int GACHA_PRICE = 350;
    public static final double CHARACTER_CHANCE = 0.6;
    public static final double COINS_PERCENT = 0.5;

    public static Map<Integer, FriendshipData> FRIENDSHIP_LVLS = Map.ofEntries(
            Map.entry(1, new FriendshipData(60,0)),
            Map.entry( 2,new FriendshipData(120,0.04)),
            Map.entry( 3,new FriendshipData(180,0.06)),
            Map.entry( 4,new FriendshipData(240,0.08)),
            Map.entry( 5,new FriendshipData(300,0.10)),
            Map.entry( 6,new FriendshipData(360,0.12)),
            Map.entry( 7,new FriendshipData(420,0.14)),
            Map.entry( 8,new FriendshipData(480,0.16)),
            Map.entry( 9,new FriendshipData(540,0.18)),
            Map.entry( 10,new FriendshipData(600,0.2))
    );
    public static final double FRIENDSHIP_EXP_PERCENT = 0.5;

    public static final SkillStageData[] SKILL_STAGES = new SkillStageData[] {
            new SkillStageData("новичок",60,0,10,0),
            new SkillStageData("продолжающий",12*60,11,20,0.1),
            new SkillStageData("опытный",24*60,21,30,0.25),
            new SkillStageData("мастер",36*60,31,Integer.MAX_VALUE,0.5)
    };
    public static final double SKILL_EXP_PERCENT = 1;

    public static final int[] ITEMS_MAX_PRICES = new int[] {10,40,120,500};
    //TODO:показывать рекомендуемые цены предметов при добавлении

}

