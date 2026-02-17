package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRep extends JpaRepository<Player,Long> {

    @Query("SELECT p.id FROM Player p WHERE p.name = :name")
    Optional<Player> findByName(@Param("name") String name);
}
