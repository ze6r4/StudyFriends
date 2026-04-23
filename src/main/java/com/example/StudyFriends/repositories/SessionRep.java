package com.example.StudyFriends.repositories;

import com.example.StudyFriends.dto.SkillStatistics;
import com.example.StudyFriends.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRep extends JpaRepository<Session, Long> {

    @Query("SELECT s.skill.id FROM Session s WHERE s.playerId.id = :playerId")
    List<Long> findUsedSkillIds(@Param("playerId") Long playerId);

    @Query("""
    SELECT new com.example.StudyFriends.dto.SkillStatistics(
        new com.example.StudyFriends.dto.SkillDto(
            s.skill.id,
            s.skill.player.id,
            s.skill.name,
            s.skill.level,
            s.skill.expInCurrentLevel,
            s.skill.isActive
        ),
        SUM((s.workTime + s.restTime) * s.cycles),
        SUM(CASE 
            WHEN s.date >= :monthStart THEN (s.workTime + s.restTime) * s.cycles 
            ELSE 0 END),
        SUM(CASE 
            WHEN s.date >= :weekStart THEN (s.workTime + s.restTime) * s.cycles 
            ELSE 0 END),
        SUM(CASE 
            WHEN s.date >= :dayStart THEN (s.workTime + s.restTime) * s.cycles 
            ELSE 0 END),
        COUNT(s.id)
                    
    )
    FROM Session s
    WHERE s.playerId.id = :playerId
      AND s.completed = true
      AND s.date IS NOT NULL
    GROUP BY 
        s.skill.id,
        s.skill.player.id,
        s.skill.name,
        s.skill.level,
        s.skill.expInCurrentLevel,
        s.skill.isActive
    """)
    List<SkillStatistics> getSkillStatistics(
            Long playerId,
            LocalDateTime monthStart,
            LocalDateTime weekStart,
            LocalDateTime dayStart
    );
    @Query("""
    SELECT s
    FROM Session s
    WHERE s.playerId.id = :playerId
      AND s.completed = true
      AND s.date BETWEEN :start AND :end
    ORDER BY s.date ASC
    """)
    List<Session> getSessionsOfPeriod(
            Long playerId,
            LocalDateTime start,
            LocalDateTime end
    );

}