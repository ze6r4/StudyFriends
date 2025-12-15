package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Skill;
import lombok.Data;

@Data
public class SkillDto {
    private Long skillId;
    private Long playerId;
    private String name;
    private Integer progress;

    public static SkillDto fromEntity(Skill skill) {
        SkillDto response = new SkillDto();
        response.setSkillId(skill.getId());
        response.setName(skill.getName());
        response.setProgress(skill.getProgress());
        response.setPlayerId(skill.getPlayer() != null ? skill.getPlayer().getId() : null);
        return response;
    }
}
