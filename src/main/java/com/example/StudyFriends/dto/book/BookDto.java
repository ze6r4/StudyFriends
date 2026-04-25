package com.example.StudyFriends.dto.book;

import lombok.Data;

import java.util.List;

@Data
public class BookDto {
    public List<MonthStatistic> months;
    public Integer totalCountOfHours;
    public Integer totalCountOfSessions;
}
