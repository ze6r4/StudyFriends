package com.example.StudyFriends.controllers;


import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.model.Session;
import com.example.StudyFriends.model.Skill;
import com.example.StudyFriends.services.FriendService;
import com.example.StudyFriends.services.PlayerService;
import com.example.StudyFriends.services.SessionService;
import com.example.StudyFriends.services.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class SessionController {
    @Autowired
    private SessionService sessionService;

    @Autowired
    private PlayerService playerService;

    @Autowired
    private FriendService friendService;

    @Autowired
    private SkillService skillService;

    @PostMapping("/sessions")
    public ResponseEntity<?> addSession(@RequestBody SessionDto dto) {
        Session session = new Session();
        //кастомная обработка ошибок в классе ResourceNotFoundException

        try{
            Player player = playerService.getPlayerById(dto.getPlayerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Player", dto.getPlayerId()));
            Friend friend = friendService.getFriendById(dto.getFriendId())
                    .orElseThrow(() -> new ResourceNotFoundException("Friend",dto.getFriendId()));
            Skill skill = skillService.getSkillById(dto.getSkillId())
                    .orElseThrow(() -> new ResourceNotFoundException("Skill",dto.getSkillId()));

            session.setPlayerId(player);
            session.setFriend(friend);
            session.setSkill(skill);
            session.setCompleted(false);
            sessionService.addSession(session);

            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }


    }
}
