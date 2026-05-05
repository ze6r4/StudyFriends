package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRep extends JpaRepository<Session, Long> {

    @Query("SELECT s.skill.id FROM Session s WHERE s.playerId.id = :playerId")
    List<Long> findUsedSkillIds(@Param("playerId") Long playerId);

    @Query("""
        SELECT s
        FROM Session s
        WHERE s.playerId.id = :userId
    """)
    List<Session> getAllSessionsOfPlayer(Long userId);

    @Query("""
    SELECT COALESCE(SUM((s.workTime + s.restTime)*s.cycles), 0)
    FROM Session s
    WHERE s.playerId.id = :playerId
      AND s.completed = true
""")
    Integer getTotalMinutes(Long playerId);

    @Query("""
    SELECT 
        DATE(s.date) as day,
        SUM((s.workTime + s.restTime)*s.cycles) as total
    FROM Session s
    WHERE s.playerId.id = :playerId
      AND s.completed = true
    GROUP BY DATE(s.date)
""")
    List<Object[]> getDailyTotals(Long playerId);

    @Query("""
    SELECT s
    FROM Session s
    WHERE s.playerId.id = :playerId
      AND s.completed = true
    ORDER BY s.date
""")
    List<Session> getAllCompletedSessions(Long playerId);//отсортированы по дням

}