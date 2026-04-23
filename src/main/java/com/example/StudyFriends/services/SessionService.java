package com.example.StudyFriends.services;

import com.example.StudyFriends.dto.SkillStatistics;
import com.example.StudyFriends.model.Session;
import com.example.StudyFriends.repositories.SessionRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
                .with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
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


}
