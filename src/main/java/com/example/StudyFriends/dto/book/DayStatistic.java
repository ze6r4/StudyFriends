package com.example.StudyFriends.dto.book;

import com.example.StudyFriends.dto.SessionDto;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DayStatistic {
    private String dayName;
    private LocalDate date;
    private List<SessionDto> sessions;
    private Boolean isEmpty;
    private List<TotalOfSkill> totalCountBySkills;
    private Integer totalCountOfMinutes;
}
