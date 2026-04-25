package com.example.StudyFriends.dto.book;

import lombok.Data;

import java.util.List;

@Data
public class WeekStatistic {
    private String weekName;
    private List<DayStatistic> days;
    private List<TotalOfSkill> totalCountBySkills;
    private Integer totalCountOfMinutes;
}