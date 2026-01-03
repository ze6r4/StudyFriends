package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.FriendDto;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.services.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class FriendController {
    @Autowired
    private FriendService friendService;

    @GetMapping("/friends")
    public ResponseEntity<?> getFriendsOfPlayer(@RequestParam Long playerId) {
        try{
            List<Friend> friends = friendService.getAllFriendsOfPlayer(playerId);
            List<FriendDto> response = friends.stream()
                    .map(FriendDto::fromEntity)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }
}
