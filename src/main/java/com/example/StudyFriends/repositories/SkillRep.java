package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRep extends JpaRepository<Skill,Long> {
    @Query("SELECT s FROM Skill s WHERE s.player.id = :playerId")
    List<Skill> findSkillsByPlayerId(@Param("playerId") Long playerId);

}
