package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.VisitDto;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.services.FriendService;
import com.example.StudyFriends.services.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class VisitController {
    @Autowired
    private VisitService visitService;
    @Autowired
    private FriendService friendService;
//    @GetMapping("/visitors")
//    public ResponseEntity<?> getVisitor(@RequestParam Long playerFriendId) {
//        try{
//            FriendVisit visit = visitService.getVisitor(playerFriendId);
//
//            return ResponseEntity.ok(visit);
//        } catch (Exception ex) {
//            return ResponseEntity
//                    .status(HttpStatus.BAD_REQUEST)
//                    .body("Ошибка: " + ex.getMessage());
//        }
//    }
    @GetMapping("/visitors")
    public ResponseEntity<?> getAllVisitors(@RequestParam Long playerId) {
        try{
            List<Friend> friends = friendService.getAllFriendsOfPlayer(playerId);
            List<VisitDto> visits = friends.stream()
                    .map(Friend::getId)
                    .map(i -> visitService.getVisitor(i))
                    .filter(Objects::nonNull)
                    .map(VisitDto::fromEntity)
                    .toList();
            return ResponseEntity.ok(visits);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }


}
