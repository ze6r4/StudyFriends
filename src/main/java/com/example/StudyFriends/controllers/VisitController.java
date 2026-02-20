package com.example.StudyFriends.controllers;

import com.example.StudyFriends.model.FriendVisit;
import com.example.StudyFriends.services.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class VisitController {
    @Autowired
    private VisitService visitService;
    @GetMapping("/visitors")
    public ResponseEntity<?> getFriendsOfPlayer(@RequestParam Long playerFriendId) {
        try{
            List<FriendVisit> visits = visitService.getAllVisitors(playerFriendId);

            return ResponseEntity.ok(visits);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }

}
