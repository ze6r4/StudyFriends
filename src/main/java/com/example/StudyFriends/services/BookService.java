package com.example.StudyFriends.services;

import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.dto.SkillDto;
import com.example.StudyFriends.dto.book.BlockDto;
import com.example.StudyFriends.dto.book.PageType;
import com.example.StudyFriends.model.Session;
import com.example.StudyFriends.model.Skill;
import com.example.StudyFriends.repositories.SessionRep;
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

    public List<BlockDto> getBook(Long playerId) {

        List<Session> sessions = sessionRep.getAllCompletedSessions(playerId);

        Locale locale = new Locale("ru", "RU");

        // 🔹 группировка по месяцам
        Map<YearMonth, List<Session>> byMonth = sessions.stream()
                .collect(Collectors.groupingBy(s -> YearMonth.from(s.getDate())));

        List<BlockDto> result = new ArrayList<>();

        // 🔥 COVER
        result.add(createCoverBlock(byMonth));

        for (var monthEntry : byMonth.entrySet()) {

            YearMonth ym = monthEntry.getKey();
            List<Session> monthSessions = monthEntry.getValue();

            // 🔹 MONTH блок
            result.add(createMonthBlock(ym, monthSessions, locale));

            // 🔹 группировка по неделям
            Map<Integer, List<Session>> byWeek = monthSessions.stream()
                    .collect(Collectors.groupingBy(s ->
                            s.getDate().get(java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR)
                    ));

            int weekIndex = 1;

            for (var weekEntry : byWeek.entrySet()) {

                List<Session> weekSessions = weekEntry.getValue();

                // 🔹 группировка по дням
                Map<LocalDate, List<Session>> byDay = weekSessions.stream()
                        .collect(Collectors.groupingBy(s -> s.getDate().toLocalDate()));

                List<LocalDate> sortedDays = byDay.keySet().stream()
                        .sorted()
                        .toList();

                for (LocalDate day : sortedDays) {

                    List<Session> daySessions = byDay.get(day);

                    for (int i = 0; i < daySessions.size(); i++) {

                        Session session = daySessions.get(i);

                        boolean isFirst = i == 0;
                        boolean isLast = i == daySessions.size() - 1;

                        result.add(createSessionBlock(
                                session,
                                day,
                                isFirst,
                                isLast,
                                daySessions,
                                locale
                        ));
                    }
                }

                // 🔹 WEEK блок
                result.add(createWeekBlock(weekSessions, weekIndex++));
            }
        }

        return result;
    }

    // =========================================
    // 🔥 BLOCKS
    // =========================================

    private BlockDto createCoverBlock(Map<YearMonth, List<Session>> byMonth) {

        BlockDto block = new BlockDto();

        block.setType(PageType.COVER);
        block.setPageCovering("FULL");
        block.setTitle("Содержание");

        List<Map<String, Object>> months = new ArrayList<>();

        for (var entry : byMonth.entrySet()) {
            months.add(Map.of(
                    "month", entry.getKey().getMonthValue(),
                    "year", entry.getKey().getYear(),
                    "sessions", entry.getValue().size()
            ));
        }

        block.setData(Map.of(
                "months", months,
                "totalSessions", byMonth.values().stream().mapToInt(List::size).sum()
        ));

        return block;
    }

    private BlockDto createMonthBlock(YearMonth ym, List<Session> sessions, Locale locale) {

        BlockDto block = new BlockDto();

        block.setType(PageType.MONTH);
        block.setPageCovering("FULL");

        block.setTitle(
                ym.getMonth().getDisplayName(TextStyle.FULL_STANDALONE, locale)
        );

        // 🔥 группировка по дням
        Map<LocalDate, Integer> dailyMinutes = sessions.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getDate().toLocalDate(),
                        Collectors.summingInt(Session::getTotal)
                ));

        int daysInMonth = ym.lengthOfMonth();
        List<Integer> daysHours = new ArrayList<>();

        for (int i = 1; i <= daysInMonth; i++) {
            LocalDate date = ym.atDay(i);

            int minutes = dailyMinutes.getOrDefault(date, 0);
            daysHours.add(minutes / 60); // 👈 как у тебя было
        }

        int totalMinutes = sessions.stream()
                .mapToInt(Session::getTotal)
                .sum();

        block.setData(Map.of(
                "year", ym.getYear(),
                "monthIndex", ym.getMonthValue() - 1,
                "totalMinutes", totalMinutes,
                "daysHours", daysHours
        ));

        return block;
    }

    private BlockDto createWeekBlock(List<Session> sessions, int index) {

        BlockDto block = new BlockDto();

        block.setType(PageType.WEEK);
        block.setPageCovering("FULL");

        block.setTitle("Итоги недели " + index);

        int totalMinutes = sessions.stream()
                .mapToInt(Session::getTotal)
                .sum();

        Map<Skill, Integer> skillMap = sessions.stream()
                .collect(Collectors.groupingBy(
                        Session::getSkill,
                        Collectors.summingInt(Session::getTotal)
                ));

        List<Map<String, Object>> skills = skillMap.entrySet().stream()
                .map(e -> Map.of(
                        "skill", SkillDto.fromEntity(e.getKey()),
                        "minutes", e.getValue()
                ))
                .toList();

        block.setData(Map.of(
                "totalMinutes", totalMinutes,
                "skills", skills
        ));

        return block;
    }

    private BlockDto createSessionBlock(
            Session session,
            LocalDate date,
            boolean isFirst,
            boolean isLast,
            List<Session> daySessions,
            Locale locale
    ) {

        BlockDto block = new BlockDto();

        block.setType(PageType.SESSION);
        block.setPageCovering("FLOW");

        // 🔹 title только у первой
        if (isFirst) {
            block.setTitle(
                    date.getDayOfWeek()
                            .getDisplayName(TextStyle.FULL, locale)
            );
        } else {
            block.setTitle(null);
        }

        SessionDto dto = SessionDto.fromEntity(session);

        // 🔥 если последняя — добавляем итоги дня прямо в data
        if (isLast) {

            int totalMinutes = daySessions.stream()
                    .mapToInt(Session::getTotal)
                    .sum();

            Map<Skill, Integer> skillMap = daySessions.stream()
                    .collect(Collectors.groupingBy(
                            Session::getSkill,
                            Collectors.summingInt(Session::getTotal)
                    ));

            List<Map<String, Object>> skills = skillMap.entrySet().stream()
                    .map(e -> Map.of(
                            "skill", SkillDto.fromEntity(e.getKey()),
                            "minutes", e.getValue()
                    ))
                    .toList();

            block.setData(Map.of(
                    "session", dto,
                    "dayTotal", Map.of(
                            "totalMinutes", totalMinutes,
                            "skills", skills
                    )
            ));

        } else {
            block.setData(dto);
        }

        return block;
    }
}