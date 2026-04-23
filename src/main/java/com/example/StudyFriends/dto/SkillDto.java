package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Skill;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillDto {
    private Long skillId;
    private Long playerId;
    private String name;
    private Integer level;
    private Double expInCurrentLevel;
    private Boolean isActive;
    private Boolean usedInSessions;

    public static SkillDto fromEntity(Skill skill) {
        SkillDto response = new SkillDto();
        response.setSkillId(skill.getId());
        response.setName(skill.getName());
        response.setLevel(skill.getLevel());
        response.setExpInCurrentLevel(skill.getExpInCurrentLevel());
        response.setPlayerId(skill.getPlayer() != null ? skill.getPlayer().getId() : null);
        response.setIsActive(skill.getIsActive());
        return response;
    }
    public SkillDto(Long id, Long playerId, String name, Integer level, Double exp, Boolean isActive) {
        this.skillId = id;
        this.playerId = playerId;
        this.name = name;
        this.level = level;
        this.expInCurrentLevel = exp;
        this.isActive = isActive;
    }
}
