package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.VisitDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.model.FriendVisit;
import com.example.StudyFriends.services.FriendService;
import com.example.StudyFriends.services.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class VisitController {
    @Autowired
    private VisitService visitService;
    @Autowired
    private FriendService friendService;

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
    @PostMapping("/visitors")
    public ResponseEntity<?> addVisitor(@RequestBody VisitDto dto) {
        FriendVisit visit = new FriendVisit();
        try{
            Friend friend = friendService.getFriendById(dto.getPlayerFriendId())
                    .orElseThrow(() -> new ResourceNotFoundException("Friend",dto.getPlayerFriendId()));

            visit.setPlayerFriend(friend);
            visit.setX(dto.getX());
            visit.setY(dto.getY());
            visit.setDirection(dto.getDirection());
            visit.setFriendAction(dto.getFriendAction());

            FriendVisit savedVisitor = visitService.addVisitor(visit);
            visit.setId(savedVisitor.getId());

            return ResponseEntity.ok(VisitDto.fromEntity(visit));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }


    }


}
