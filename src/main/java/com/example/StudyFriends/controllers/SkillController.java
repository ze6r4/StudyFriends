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

    // более сложный get-запрос с проверкой существования skill в таблице session
    @GetMapping("/skills/full")
    public ResponseEntity<?> getFullSkillsOfPlayer(@RequestParam Long playerId) {
        try{
            List<SkillDto> response = skillService.getFullSkills(playerId);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }

    @PatchMapping("/skills/{id}")
    public ResponseEntity<?> updateSkill(
            @PathVariable Long id,
            @RequestBody SkillDto dto
    ) {
        try {
            Skill skill = skillService.getSkillById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Skill", id));

            if (dto.getName() != null) {
                skill.setName(dto.getName());
            }

            if (dto.getProgress() != null) {
                skill.setProgress(dto.getProgress());
            }
            skill.setIsActive(true);

            Skill updatedSkill = skillService.updateSkill(skill);
            return ResponseEntity.ok(SkillDto.fromEntity(updatedSkill));

        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }

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

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        try {
            skillService.deleteSkill(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }
    }
}
