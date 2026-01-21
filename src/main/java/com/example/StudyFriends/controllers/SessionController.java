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
            session.setWorkTime(dto.getWorkMinutes());
            session.setRestTime(dto.getRestMinutes());
            session.setCycles(dto.getCycles());
            session.setCompleted(false);
            Session savedSession = sessionService.addSession(session);
            session.setId(savedSession.getId());

            return ResponseEntity.ok(SessionDto.fromEntity(session));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }


    }
    @PatchMapping("/sessions/{id}")
    public ResponseEntity<?> editSession(@PathVariable Long id, @RequestBody SessionDto dto) {
        try {
            // Получаем существующую сессию
            Session session = sessionService.getSessionById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Session", id));

            // Обновляем базовые поля только если они переданы (не null)
            if (dto.getWorkMinutes() != null) {
                session.setWorkTime(dto.getWorkMinutes());
            }
            if (dto.getRestMinutes() != null) {
                session.setRestTime(dto.getRestMinutes());
            }
            if (dto.getCycles() != null) {
                session.setCycles(dto.getCycles());
            }
            if (dto.getCompleted() != null) {
                session.setCompleted(dto.getCompleted());
            }

            // Обновляем связанные сущности только если их ID переданы (не null)
            if (dto.getPlayerId() != null) {
                Player player = playerService.getPlayerById(dto.getPlayerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Player", dto.getPlayerId()));
                session.setPlayerId(player);
            }

            if (dto.getFriendId() != null && dto.getPlayerId() != null) {

                Friend friend = friendService.getFriendById(dto.getFriendId())
                        .orElseThrow(() -> new ResourceNotFoundException("Friend", dto.getFriendId()));
                session.setFriend(friend);
            }

            if (dto.getSkillId() != null) {
                Skill skill = skillService.getSkillById(dto.getSkillId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skill", dto.getSkillId()));
                session.setSkill(skill);
            }

            // Сохраняем обновленную сессию
            Session updatedSession = sessionService.updateSession(session);

            // Преобразуем в DTO для ответа
            SessionDto responseDto = SessionDto.fromEntity(updatedSession);

            return ResponseEntity.ok(responseDto);

        } catch (ResourceNotFoundException ex) {
            // Обработка кастомной ошибки
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }
}
