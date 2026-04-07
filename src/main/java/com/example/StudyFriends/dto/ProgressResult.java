package com.example.StudyFriends.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProgressResult {
    private int level;
    private int exp;
    private int gainedLevels;
}
