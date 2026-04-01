package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.RewardDto;
import com.example.StudyFriends.dto.SessionDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RewardController {
    @RequestMapping("/reward")
    public ResponseEntity<?> getReward(@RequestBody SessionDto sessionDto) {
        RewardDto reward = new RewardDto();
        reward.setCoins(10);
        reward.setFriendExp(10);
        reward.setSkillExp(10);
        return ResponseEntity.ok(reward);
    }


}
