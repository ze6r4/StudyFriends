package com.example.StudyFriends.services;

import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.dto.SkillDto;
import com.example.StudyFriends.dto.book.*;
import com.example.StudyFriends.model.Session;
import com.example.StudyFriends.model.Skill;
import com.example.StudyFriends.repositories.SessionRep;
import com.example.StudyFriends.repositories.SkillRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class BookService {
    private final SessionRep sessionRep;
    private final SkillRep skillRep;

    public BookDto getBook(Long playerId) {
        BookDto book = new BookDto();
        book.setMonths(getMonths(playerId));
        List<Session> allSessions = sessionRep.getAllSessionsOfPlayer(playerId);
        Integer total = allSessions.stream().mapToInt(Session::getTotal).sum();
        book.setTotalCountOfSessions(total);
        return book;
    }
    private List<MonthStatistic> getMonths(Long playerId) {
        List<Session> sessions = sessionRep.getAllSessionsOfPlayer(playerId);
        Locale locale = new Locale("ru", "RU");

        Map<YearMonth, List<Session>> groupedByMonth = sessions.stream()
                .filter(Session::getCompleted)
                .collect(Collectors.groupingBy(s ->
                        YearMonth.from(s.getDate())
                )); //сессии по месяцам

        List<MonthStatistic> result = new ArrayList<>();

        groupedByMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    YearMonth ym = entry.getKey();
                    List<Session> monthSessions = entry.getValue();

                    MonthStatistic month = new MonthStatistic();
                    month.setMonthName(
                            ym.getMonth().getDisplayName(TextStyle.FULL_STANDALONE, locale)
                    );

                    month.setWeeks(getWeeks(monthSessions));
                    month.setDaysHours(hoursOfEveryDay(monthSessions));

                    return month;
                })
                .toList();
        //заполнение каждого месяца по неделям
        for (var entry : groupedByMonth.entrySet()) {
            YearMonth ym = entry.getKey();
            List<Session> monthSessions = entry.getValue();

            MonthStatistic month = new MonthStatistic();
            month.setMonthName(ym.getMonth().getDisplayName(TextStyle.FULL_STANDALONE, locale));
            month.setWeeks(getWeeks(monthSessions));
            month.setDaysHours(hoursOfEveryDay(monthSessions));

            result.add(month);
        }

        return result;
    }
    private List<WeekStatistic> getWeeks(List<Session> monthSessions){
        // сессии по неделям
        Map<Integer, List<Session>> byWeek = monthSessions.stream()
                .collect(Collectors.groupingBy(s -> {
                    int day = s.getDate().getDayOfMonth();
                    return (day - 1) / 7 + 1; // номер недели от 1 до 5
                }
                ));

        List<WeekStatistic> weeks = new ArrayList<>();

        byWeek.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> getWeek(e.getValue(), e.getKey()))
                .toList();//сортировка недель по порядку

        for (var weekEntry : byWeek.entrySet()) {
            weeks.add(getWeek(weekEntry.getValue(), weekEntry.getKey()));
        }
        return weeks;
    }
    private List<Integer> hoursOfEveryDay(List<Session> monthSessions){
        Map<LocalDate, Integer> map = monthSessions.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getDate().toLocalDate(),
                        Collectors.summingInt(Session::getTotal)
                ));

        YearMonth ym = YearMonth.from(monthSessions.get(0).getDate());
        int daysInMonth = ym.lengthOfMonth();
        List<Integer> result = new ArrayList<>();
        for (int i = 1; i <= daysInMonth; i++) {
            LocalDate date = ym.atDay(i);
            result.add(map.getOrDefault(date, 0) / 60);
        }
        return result;
    }

    private WeekStatistic getWeek(List<Session> sessions, Integer weekNumber) {
        WeekStatistic week = new WeekStatistic();
        week.setWeekName("Неделя " + weekNumber);

        Map<LocalDate, List<Session>> byDay = sessions.stream()
                .collect(Collectors.groupingBy(s -> s.getDate().toLocalDate()));

        List<DayStatistic> days = new ArrayList<>();

        for (var entry : byDay.entrySet()) {
            days.add(getDay(entry.getKey(), entry.getValue()));
        }
        week.setDays(days);

        // общее время
        int totalMinutes = sessions.stream()
                .mapToInt(Session::getTotal)
                .sum();

        week.setTotalCountOfMinutes(totalMinutes);

        // по навыкам
        Map<Skill, Integer> skillMap = sessions.stream()
                .collect(Collectors.groupingBy(
                        Session::getSkill,
                        Collectors.summingInt(Session::getTotal)
                ));

        List<TotalOfSkill> skills = skillMap.entrySet().stream()
                .map(e -> new TotalOfSkill(SkillDto.fromEntity(e.getKey()), e.getValue()))
                .toList();

        week.setTotalCountBySkills(skills);

        return week;
    }
    private DayStatistic getDay(LocalDate date, List<Session> sessions) {
        DayStatistic day = new DayStatistic();

        day.setDayName(date.getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.getDefault()));

        // сессии → DTO
        List<SessionDto> sessionDtos = sessions.stream()
                .map(SessionDto::fromEntity)
                .toList();

        day.setSessions(sessionDtos);

        // общее время
        int totalMinutes = sessions.stream()
                .mapToInt(Session::getTotal)
                .sum();

        day.setTotalCountOfMinutes(totalMinutes);

        // по навыкам (можно использовать репозиторий, но быстрее тут)
        Map<Skill, Integer> skillMap = sessions.stream()
                .collect(Collectors.groupingBy(
                        Session::getSkill,
                        Collectors.summingInt(Session::getTotal)
                ));

        List<TotalOfSkill> skills = skillMap.entrySet().stream()
                .map(e -> new TotalOfSkill(SkillDto.fromEntity(e.getKey()), e.getValue()))
                .toList();

        day.setTotalCountBySkills(skills);

        return day;
    }

}