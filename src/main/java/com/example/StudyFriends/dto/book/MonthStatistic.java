package com.example.StudyFriends.dto.book;

import lombok.Data;

import java.util.List;

@Data
public class MonthStatistic {
    private String monthName;
    public List<WeekStatistic> weeks;
    public List<Integer> daysHours;
    public static Integer[] standardOfHours = new Integer[] {2,4,6};
}
