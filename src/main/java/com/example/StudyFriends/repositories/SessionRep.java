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

}