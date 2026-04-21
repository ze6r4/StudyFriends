package com.example.StudyFriends.services;

import com.example.StudyFriends.config.RewardConfig;
import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.dto.reward.FriendReward;
import com.example.StudyFriends.dto.reward.SessionReward;
import com.example.StudyFriends.dto.reward.SkillReward;
import com.example.StudyFriends.dto.reward.SkillStageData;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.model.Skill;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class RewardService {
    private final SkillService skillService;
    private final FriendService friendService;
    private final PlayerService playerService;

    public static int totalSessionMinutes(SessionDto sessionDto) {
        int W = sessionDto.getWorkMinutes();
        int R = sessionDto.getRestMinutes();
        int C = sessionDto.getCycles();
        return (W+R)*C;
    }

    public RewardService(
            SkillService skillService,
            FriendService friendService,
            PlayerService playerService
    ) {
        this.skillService = skillService;
        this.friendService = friendService;
        this.playerService = playerService;
    }

    @Transactional
    public SessionReward applyRewards(SessionDto sessionDto) {
        Skill skill = skillService.getSkillById(sessionDto.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        Friend friend = friendService.getFriendById(sessionDto.getFriendId())
                .orElseThrow(() -> new RuntimeException("Friend not found"));

        Player player = playerService.getPlayerById(sessionDto.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found"));
        SessionReward sessionReward = calculateRewards(sessionDto,skill,friend);

        skill.setLevel(sessionReward.getSkillReward().getSkillNewLvl());
        skill.setExpInCurrentLevel(sessionReward.getSkillReward().getSkillExpOfLvl());
        skillService.updateSkill(skill);

        friend.setFriendshipLvl(sessionReward.getFriendReward().getFriendshipNewLvl());
        friend.setExpInCurrentLevel(sessionReward.getFriendReward().getFriendshipExpOfLvl());
        friendService.updateFriend(friend);

        int totalCoins = sessionReward.getCoinsFromSkill() + sessionReward.getCoinsFromFriendship() + sessionReward.getCoinsFromSession();

        player.setCoins(player.getCoins() + totalCoins);
        playerService.updatePlayer(player);

        return sessionReward;
    }
    private SessionReward calculateRewards(SessionDto sessionDto, Skill skill, Friend friend) {
        int totalMinutes = totalSessionMinutes(sessionDto);

        int skillLvl = skill.getLevel();
        double oldSkillExp = skill.getExpInCurrentLevel();
        int friendshipLvl = friend.getFriendshipLvl();
        double oldFriendExp = friend.getExpInCurrentLevel();

        SessionReward rewards = new SessionReward();

        double skillExp = totalMinutes * RewardConfig.SKILL_EXP_PERCENT;
        SkillReward skillReward = SkillReward.distributeExp(skillLvl,oldSkillExp+skillExp);
        double friendExp = totalMinutes * RewardConfig.FRIENDSHIP_EXP_PERCENT;
        FriendReward friendReward = FriendReward.distributeExp(friendshipLvl,oldFriendExp+friendExp);

        skillLvl = skillReward.getSkillNewLvl();
        friendshipLvl = friendReward.getFriendshipNewLvl();

        rewards.setSkillReward(skillReward);
        rewards.setFriendReward(friendReward);

        int coinsFromSession = (int) Math.round(totalMinutes * RewardConfig.COINS_PERCENT);
        rewards.setCoinsFromSession(coinsFromSession);

        double skillCoinBonus = SkillStageData.getSkillStageByLevel(skillLvl).coinBonus();
        rewards.setSkillCoinBonus(skillCoinBonus);
        rewards.setCoinsFromSkill((int) Math.round(skillCoinBonus * coinsFromSession));

        double friendshipCoinsBonus = RewardConfig.FRIENDSHIP_LVLS.get(friendshipLvl).getCoinsBonus();
        rewards.setFriendCoinBonus(friendshipCoinsBonus);
        rewards.setCoinsFromFriendship((int) Math.round( friendshipCoinsBonus * coinsFromSession));

        rewards.setTotalMinutes(totalMinutes);

        return rewards;
    }



}
