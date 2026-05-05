package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Session;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SessionDto {
    private Long id;
    private Integer workMinutes;
    private Integer restMinutes;
    private Integer cycles;
    private Long playerId;
    private Long friendId;
    private Long skillId;
    private Boolean completed;
    private String notes;
    private LocalDateTime date;
    private LocalDateTime endDate;
    private String skillName;

    public static SessionDto fromEntity(Session session) {
        SessionDto response = new SessionDto();
        response.setId(session.getId());
        response.setWorkMinutes(session.getWorkTime());
        response.setRestMinutes(session.getRestTime());
        response.setCycles(session.getCycles());
        response.setCompleted(session.getCompleted());
        response.setNotes(session.getNotes());
        response.setDate(session.getDate());
        response.setEndDate(session.getEndDate());

        // Получаем ID связанных сущностей
        if (session.getPlayerId() != null) {
            response.setPlayerId(session.getPlayerId().getId());
        }

        if (session.getFriend() != null) {
            response.setFriendId(session.getFriend().getId());
        }

        if (session.getSkill() != null) {
            response.setSkillId(session.getSkill().getId());
            response.setSkillName(session.getSkill().getName());
        }

        return response;
    }
}

