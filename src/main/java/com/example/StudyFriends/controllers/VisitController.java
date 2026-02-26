package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.FriendDto;
import com.example.StudyFriends.dto.VisitDto;
import com.example.StudyFriends.dto.VisitPanelDto;
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

@RestController
@RequestMapping("/api")
public class VisitController {
    @Autowired
    private VisitService visitService;
    @Autowired
    private FriendService friendService;

    @GetMapping("/visitors-and-not")
    public ResponseEntity<?> getVisitorsAndNot(@RequestParam Long playerId) {
        try {

            List<FriendVisit> visitors = visitService.getVisitorsOfPlayer(playerId);
            List<Friend> friendsNotVisitors = friendService.getFriendsNotVisitorsOfPlayer(playerId);

            List<FriendDto> visitDto = visitors.stream()
                    .map(FriendDto::fromEntity)
                    .toList();

            List<FriendDto> notVisitDto = friendsNotVisitors.stream()
                    .map(FriendDto::fromEntity)
                    .toList();

            return ResponseEntity.ok(
                    new VisitPanelDto(visitDto, notVisitDto)
            );

        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }
//    @GetMapping("/visitors")
//    public ResponseEntity<?> getAllVisitors(@RequestParam Long playerId) {
//        try{
//            List<Friend> friends = friendService.getAllFriendsOfPlayer(playerId);
//            List<VisitDto> visits = friends.stream()
//                    .map(Friend::getId)
//                    .map(i -> visitService.getVisitor(i))
//                    .filter(Objects::nonNull)
//                    .map(VisitDto::fromEntity)
//                    .toList();
//            return ResponseEntity.ok(visits);
//        } catch (Exception ex) {
//            return ResponseEntity
//                    .status(HttpStatus.BAD_REQUEST)
//                    .body("Ошибка: " + ex.getMessage());
//        }
//    }
    @DeleteMapping("/visitors")
    public ResponseEntity<?> deleteVisitor(@RequestParam Long playerFriendId) {
        try {
            visitService.deleteVisitor(playerFriendId);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
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
