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
    private List<BlockDto> blocks;
    public BookDto getBook(Long playerId) {
        BookDto book = new BookDto();
        book.setTotalCountOfHours(sessionRep.getTotalMinutes(playerId));
        return book;
    }

    private List<MonthStatistic> getMonths(Long playerId) {

        List<Session> sessions = sessionRep.getAllCompletedSessions(playerId);
        Locale locale = new Locale("ru", "RU");

        // 🔥 SQL данные по дням
        Map<LocalDate, Integer> dailyTotals = sessionRep.getDailyTotals(playerId)
                .stream()
                .collect(Collectors.toMap(
                        row -> ((java.sql.Date) row[0]).toLocalDate(),
                        row -> ((Number) row[1]).intValue()
                ));

        Map<YearMonth, List<Session>> groupedByMonth = sessions.stream()
                .collect(Collectors.groupingBy(s -> YearMonth.from(s.getDate())));

        List<MonthStatistic> result = new ArrayList<>();

        for (var entry : groupedByMonth.entrySet()) {

            YearMonth ym = entry.getKey();
            List<Session> monthSessions = entry.getValue();

            MonthStatistic month = new MonthStatistic();

            month.setMonthName(
                    ym.getMonth().getDisplayName(TextStyle.FULL_STANDALONE, locale)
            );
            month.setYear(ym.getYear());
            month.setMonthIndex(ym.getMonthValue() - 1); // JS: 0-11

            month.setWeeks(getWeeks(monthSessions));

            // 🔥 теперь используем SQL данные
            month.setDaysHours(buildDaysHoursFromSql(dailyTotals, ym));

            result.add(month);
        }

        return result;
    }
    private List<WeekStatistic> getWeeks(List<Session> monthSessions) {

        Map<LocalDate, List<Session>> byDate = monthSessions.stream()
                .collect(Collectors.groupingBy(s -> s.getDate().toLocalDate()));

        LocalDate firstDay = byDate.keySet().stream().min(LocalDate::compareTo).get();
        LocalDate lastDay = byDate.keySet().stream().max(LocalDate::compareTo).get();

        // двигаемся к понедельнику
        LocalDate current = firstDay.minusDays(firstDay.getDayOfWeek().getValue() - 1);

        List<WeekStatistic> weeks = new ArrayList<>();
        int weekNumber = 1;

        while (!current.isAfter(lastDay)) {

            LocalDate weekStart = current;
            LocalDate weekEnd = current.plusDays(6);

            List<Session> weekSessions = monthSessions.stream()
                    .filter(s -> {
                        LocalDate d = s.getDate().toLocalDate();
                        return !d.isBefore(weekStart) && !d.isAfter(weekEnd);
                    })
                    .toList();

            if (!weekSessions.isEmpty()) {
                weeks.add(getWeek(weekSessions, weekNumber++));
            }

            current = current.plusWeeks(1);
        }

        return weeks;
    }
    private List<Integer> buildDaysHoursFromSql(
            Map<LocalDate, Integer> map,
            YearMonth ym
    ) {
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
        week.setWeekName("Итоги недели " + weekNumber);

        Map<LocalDate, List<Session>> byDay = sessions.stream()
                .collect(Collectors.groupingBy(s -> s.getDate().toLocalDate()));

        List<DayStatistic> days = new ArrayList<>();

        // определяем границы недели
        LocalDate firstDay = sessions.stream()
                .map(s -> s.getDate().toLocalDate())
                .min(LocalDate::compareTo)
                .get();

        LocalDate weekStart = firstDay.minusDays(firstDay.getDayOfWeek().getValue() - 1);

        // 👉 проходим ВСЕ 7 дней недели
        for (int i = 0; i < 7; i++) {
            LocalDate currentDay = weekStart.plusDays(i);

            List<Session> daySessions = byDay.get(currentDay);

            if (daySessions == null) {
                // день без сессий
                DayStatistic emptyDay = new DayStatistic();
                emptyDay.setDayName(currentDay.getDayOfWeek()
                        .getDisplayName(TextStyle.FULL, Locale.getDefault()));

                emptyDay.setSessions(List.of());
                emptyDay.setTotalCountOfMinutes(0);
                emptyDay.setTotalCountBySkills(List.of());

                days.add(emptyDay);
            } else {
                days.add(getDay(currentDay, daySessions));
            }
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