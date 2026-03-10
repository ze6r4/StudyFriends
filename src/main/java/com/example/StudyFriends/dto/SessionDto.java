package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Session;
import lombok.Getter;
import lombok.Setter;

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

    public static SessionDto fromEntity(Session session) {
        SessionDto response = new SessionDto();
        response.setId(session.getId());
        response.setWorkMinutes(session.getWorkTime());
        response.setRestMinutes(session.getRestTime());
        response.setCycles(session.getCycles());
        response.setCompleted(session.getCompleted());
        response.setNotes(session.getNotes());

        // Получаем ID связанных сущностей
        if (session.getPlayerId() != null) {
            response.setPlayerId(session.getPlayerId().getId());
        }

        if (session.getFriend() != null) {
            response.setFriendId(session.getFriend().getId());
        }

        if (session.getSkill() != null) {
            response.setSkillId(session.getSkill().getId());
        }

        return response;
    }
}

