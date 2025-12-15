package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.SkillDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.model.Skill;
import com.example.StudyFriends.services.PlayerService;
import com.example.StudyFriends.services.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @Autowired
    private PlayerService playerService;

    @GetMapping("/skills")
    public ResponseEntity<?> getSkillsOfPlayer(@RequestParam Long playerId) {
        try{
            List<Skill> skills = skillService.getAllSkillsOfPlayer(playerId);
            List<SkillDto> response = skills.stream()
                    .map(SkillDto::fromEntity)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }

    @PostMapping("/skills")
    public ResponseEntity<?> addSkill(@RequestBody SkillDto dto) {
        try{
            Skill skill = new Skill();
            skill.setName(dto.getName());
            skill.setProgress(dto.getProgress());
            Player player = playerService.getPlayerById(dto.getPlayerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Player", dto.getPlayerId()));
            skill.setPlayer(player);

            Skill newSkill = skillService.addSkill(skill);
            return ResponseEntity.ok(SkillDto.fromEntity(newSkill));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }

    @DeleteMapping("/skills")
    public ResponseEntity<?> deleteSkill(@RequestParam Long id) {
        try {
            skillService.deleteSkill(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) { //А какие можно ловить ошибки???
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}
