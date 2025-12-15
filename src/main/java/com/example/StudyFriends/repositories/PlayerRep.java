package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRep extends JpaRepository<Player,Long> {
}
