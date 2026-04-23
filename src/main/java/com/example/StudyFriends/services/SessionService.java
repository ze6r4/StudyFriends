package com.example.StudyFriends.services;

import com.example.StudyFriends.dto.DaySessionsDto;
import com.example.StudyFriends.dto.SessionDto;
import com.example.StudyFriends.dto.SkillStatistics;
import com.example.StudyFriends.model.Session;
import com.example.StudyFriends.repositories.SessionRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class SessionService {
    private final SessionRep sessionRep;

    @Transactional
    public Session addSession(Session session) {
        return sessionRep.save(session);
    }

    public Session updateSession(Session session) {
        return sessionRep.save(session);
    }

    public List<Session> getAllSessions() {
        return sessionRep.findAll();
    }

    public Optional<Session> getSessionById(Long id) {
        return sessionRep.findById(id);
    }

    public List<SkillStatistics> getSkillStatistics(Long playerId) {

        LocalDateTime now = LocalDateTime.now();

        // начало дня
        LocalDateTime dayStart = now.toLocalDate().atStartOfDay();

        // начало текущей недели (понедельник)
        LocalDateTime weekStart = now
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .toLocalDate()
                .atStartOfDay();

        // начало текущего месяца
        LocalDateTime monthStart = now
                .withDayOfMonth(1)
                .toLocalDate()
                .atStartOfDay();

        return sessionRep.getSkillStatistics(
                playerId,
                monthStart,
                weekStart,
                dayStart
        );
    }

    public List<DaySessionsDto> getWeekSessions(Long playerId) {

        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        LocalDateTime start = monday.atStartOfDay();
        LocalDateTime end = LocalDateTime.now();

        List<Session> sessions = sessionRep.getSessionsOfPeriod(
                playerId,
                start,
                end
        );

        // группировка по дате (без времени)
        Map<LocalDate, List<Session>> grouped = sessions.stream()
                .collect(Collectors.groupingBy(s -> s.getDate().toLocalDate()));

        List<DaySessionsDto> result = new ArrayList<>();

        for (LocalDate date = monday; !date.isAfter(today); date = date.plusDays(1)) {

            List<SessionDto> sessionDtos = grouped.getOrDefault(date, List.of())
                    .stream()
                    .map(SessionDto::fromEntity)
                    .toList();

            DaySessionsDto dto = new DaySessionsDto();
            dto.setDayName(date.getDayOfWeek()
                    .getDisplayName(TextStyle.FULL, new Locale("ru"))); // "понедельник", "вторник" и т.д.
            dto.setSessions(sessionDtos);


            result.add(dto);
        }

        return result;
    }
}
