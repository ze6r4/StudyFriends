package com.example.StudyFriends.dto;

import lombok.Data;

import java.util.List;

@Data
public class DaySessionsDto {
    private String dayName;
    private List<SessionDto> sessions;
}