package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.PlayerItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerItemRep extends JpaRepository<PlayerItem,Long> {
    @Query("SELECT i FROM PlayerItem i WHERE i.player.id = :playerId")
    List<PlayerItem> findItemsByPlayerId(@Param("playerId") Long playerId);

}
