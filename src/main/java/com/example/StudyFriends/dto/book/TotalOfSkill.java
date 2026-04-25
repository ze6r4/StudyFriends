package com.example.StudyFriends.dto.book;

import com.example.StudyFriends.dto.SkillDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TotalOfSkill {
    private SkillDto skill;
    private Integer totalMinutes;
}
