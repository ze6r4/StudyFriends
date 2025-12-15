package com.example.StudyFriends.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionDto {
    private Integer workMinutes;
    private Integer restMinutes;
    private Integer cycles;
    private Long playerId;
    private Long friendId;
    private Long skillId;
}

