package com.example.StudyFriends.controllers;

import com.example.StudyFriends.config.RewardConfig;
import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.dto.reward.SessionReward;
import com.example.StudyFriends.services.RewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    @Autowired
    private RewardService rewardService;

    @PostMapping
    public ResponseEntity<?> postRewards(@RequestBody SessionDto sessionDto) {
        try {
            SessionReward rewards = rewardService.applyRewards(sessionDto);

            return ResponseEntity.ok(rewards);

        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }
    @GetMapping("/skill/levels")
    public ResponseEntity<?> getSkillStages() {
        return ResponseEntity.ok(RewardConfig.SKILL_STAGES);
    }
}