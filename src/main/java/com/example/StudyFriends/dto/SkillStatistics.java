package com.example.StudyFriends.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SkillStatistics {
    private SkillDto skill;
    private Long totalMinutes;
    private Long minutesOfMonth;
    private Long minutesOfWeek;
    private Long minutesOfDay;
    private Long totalCountOfSessions;
}