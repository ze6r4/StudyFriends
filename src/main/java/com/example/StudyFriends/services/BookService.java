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

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class BookService {

    private final SessionRep sessionRep;

    public List<BlockDto> getBook(Long playerId) {

        List<Session> sessions = sessionRep
                .getAllCompletedSessions(playerId);

        Locale locale = new Locale("ru", "RU");

        // Месяц -> Неделя -> Сессии
        Map<YearMonth, Map<LocalDate, List<Session>>> byMonthAndWeek =
                sessions.stream()
                        .collect(Collectors.groupingBy(
                                s -> YearMonth.from(s.getDate()),
                                LinkedHashMap::new,
                                Collectors.groupingBy(
                                        s -> getWeekStart(
                                                s.getDate().toLocalDate()
                                        ),
                                        LinkedHashMap::new,
                                        Collectors.toList()
                                )
                        ));

        List<BlockDto> result = new ArrayList<>();

        // COVER
        result.add(createCoverBlock(byMonthAndWeek));

        for (var monthEntry : byMonthAndWeek.entrySet()) {

            YearMonth ym = monthEntry.getKey();
            Map<LocalDate, List<Session>> weeks =
                    monthEntry.getValue();

            List<Session> monthSessions = weeks.values()
                    .stream()
                    .flatMap(List::stream)
                    .toList();

            // MONTH
            result.add(createMonthBlock(
                    ym,
                    monthSessions,
                    locale
            ));

            // WEEKS
            for (var weekEntry : weeks.entrySet()) {

                LocalDate weekStart =
                        weekEntry.getKey();

                List<Session> weekSessions =
                        weekEntry.getValue();

                // DAY GROUPING
                Map<LocalDate, List<Session>> byDay =
                        weekSessions.stream()
                                .collect(Collectors.groupingBy(
                                        s -> s.getDate().toLocalDate(),
                                        LinkedHashMap::new,
                                        Collectors.toList()
                                ));

                for (var dayEntry : byDay.entrySet()) {

                    LocalDate day =
                            dayEntry.getKey();

                    List<Session> daySessions =
                            dayEntry.getValue();

                    for (int i = 0;
                         i < daySessions.size();
                         i++) {

                        Session session =
                                daySessions.get(i);

                        boolean isFirst =
                                i == 0;

                        boolean isLast =
                                i == daySessions.size() - 1;

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

                // WEEK SUMMARY
                result.add(createWeekBlock(
                        weekSessions,
                        weekStart,
                        ym
                ));
            }
        }

        return result;
    }

    private static LocalDate getWeekStart(LocalDate date) {

        YearMonth ym = YearMonth.from(date);

        // понедельник текущей недели
        LocalDate monday =
                date.with(
                        TemporalAdjusters
                                .previousOrSame(
                                        DayOfWeek.MONDAY
                                )
                );

        // если ушли в прошлый месяц —
        // стартуем с 1 числа
        if (!YearMonth.from(monday)
                .equals(ym)) {

            return ym.atDay(1);
        }

        return monday;
    }

    // =========================================
    // BLOCKS
    // =========================================

    private BlockDto createCoverBlock(
            Map<YearMonth,
                    Map<LocalDate,
                            List<Session>>> byMonthAndWeek
    ) {

        BlockDto block = new BlockDto();

        block.setType(PageType.COVER);
        block.setPageCovering("FULL");
        block.setTitle("Содержание");

        List<Map<String, Object>> months =
                new ArrayList<>();

        for (var entry :
                byMonthAndWeek.entrySet()) {

            int sessionsCount =
                    entry.getValue()
                            .values()
                            .stream()
                            .mapToInt(List::size)
                            .sum();

            months.add(Map.of(
                    "month",
                    entry.getKey()
                            .getMonthValue(),
                    "year",
                    entry.getKey()
                            .getYear(),
                    "sessions",
                    sessionsCount
            ));
        }

        int totalSessions =
                byMonthAndWeek.values()
                        .stream()
                        .flatMap(
                                weeks -> weeks.values()
                                        .stream()
                        )
                        .mapToInt(List::size)
                        .sum();

        block.setData(Map.of(
                "months", months,
                "totalSessions",
                totalSessions
        ));

        return block;
    }

    private BlockDto createMonthBlock(
            YearMonth ym,
            List<Session> sessions,
            Locale locale
    ) {

        BlockDto block = new BlockDto();

        block.setType(PageType.MONTH);
        block.setPageCovering("FULL");

        block.setTitle(
                ym.getMonth()
                        .getDisplayName(
                                TextStyle.FULL_STANDALONE,
                                locale
                        )
        );

        Map<LocalDate, Integer> dailyMinutes =
                sessions.stream()
                        .collect(Collectors.groupingBy(
                                s -> s.getDate()
                                        .toLocalDate(),
                                Collectors.summingInt(
                                        Session::getTotal
                                )
                        ));

        int daysInMonth =
                ym.lengthOfMonth();

        List<Integer> daysHours =
                new ArrayList<>();

        for (int i = 1;
             i <= daysInMonth;
             i++) {

            LocalDate date =
                    ym.atDay(i);

            int minutes =
                    dailyMinutes
                            .getOrDefault(
                                    date,
                                    0
                            );

            daysHours.add(
                    minutes / 60
            );
        }

        int totalMinutes =
                sessions.stream()
                        .mapToInt(
                                Session::getTotal
                        )
                        .sum();

        block.setData(Map.of(
                "year",
                ym.getYear(),
                "monthIndex",
                ym.getMonthValue() - 1,
                "totalMinutes",
                totalMinutes,
                "daysHours",
                daysHours
        ));

        return block;
    }

    private BlockDto createWeekBlock(
            List<Session> sessions,
            LocalDate weekStart,
            YearMonth ym
    ) {

        BlockDto block = new BlockDto();

        block.setType(PageType.WEEK);
        block.setPageCovering("FULL");

        LocalDate monthEnd =
                ym.atEndOfMonth();

        LocalDate weekEnd =
                weekStart.plusDays(6);

        if (weekEnd.isAfter(monthEnd)) {
            weekEnd = monthEnd;
        }

        block.setTitle(
                "итоги недели с "
                        + weekStart.getDayOfMonth()
                        + " по "
                        + weekEnd.getDayOfMonth()
        );

        int totalMinutes =
                sessions.stream()
                        .mapToInt(
                                Session::getTotal
                        )
                        .sum();

        Map<Skill, Integer> skillMap =
                sessions.stream()
                        .collect(Collectors.groupingBy(
                                Session::getSkill,
                                Collectors.summingInt(
                                        Session::getTotal
                                )
                        ));

        List<Map<String, Object>> skills =
                skillMap.entrySet()
                        .stream()
                        .map(e -> Map.of(
                                "skill",
                                SkillDto.fromEntity(
                                        e.getKey()
                                ),
                                "minutes",
                                e.getValue()
                        ))
                        .toList();

        block.setData(Map.of(
                "totalMinutes",
                totalMinutes,
                "skills",
                skills
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

        BlockDto block =
                new BlockDto();

        block.setType(
                PageType.SESSION
        );

        block.setPageCovering(
                "FLOW"
        );

        if (isFirst) {

            block.setTitle(
                    date.getDayOfWeek()
                            .getDisplayName(
                                    TextStyle.FULL,
                                    locale
                            )
            );

        } else {
            block.setTitle(null);
        }

        SessionDto dto =
                SessionDto
                        .fromEntity(session);

        if (isLast) {

            int totalMinutes =
                    daySessions.stream()
                            .mapToInt(
                                    Session::getTotal
                            )
                            .sum();

            Map<Skill, Integer> skillMap =
                    daySessions.stream()
                            .collect(Collectors.groupingBy(
                                    Session::getSkill,
                                    Collectors.summingInt(
                                            Session::getTotal
                                    )
                            ));

            List<Map<String, Object>>
                    skills =
                    skillMap.entrySet()
                            .stream()
                            .map(e -> Map.of(
                                    "skill",
                                    SkillDto.fromEntity(
                                            e.getKey()
                                    ),
                                    "minutes",
                                    e.getValue()
                            ))
                            .toList();

            block.setData(Map.of(
                    "session",
                    dto,
                    "dayTotal",
                    Map.of(
                            "totalMinutes",
                            totalMinutes,
                            "skills",
                            skills
                    )
            ));

        } else {
            block.setData(dto);
        }

        return block;
    }
}