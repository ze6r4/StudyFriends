package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.dto.reward.SessionReward;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.model.Skill;
import com.example.StudyFriends.services.FriendService;
import com.example.StudyFriends.services.RewardService;
import com.example.StudyFriends.services.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    @Autowired
    private RewardService rewardService;
    @Autowired
    private SkillService skillService;
    @Autowired
    private FriendService friendService;

    @PostMapping
    public ResponseEntity<?> getRewards(@RequestBody SessionDto sessionDto) {
        try {
            Skill skill = skillService.getSkillById(sessionDto.getSkillId()).orElseThrow();
            Friend friend = friendService.getFriendById(sessionDto.getFriendId()).orElseThrow();

            SessionReward reward = rewardService.calculateRewards(
                    sessionDto,
                    skill.getLevel(),
                    skill.getExpAmount(),
                    friend.getFriendshipLvl(),
                    friend.getExpAmount()
            );

            return ResponseEntity.ok(reward);

        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }
}