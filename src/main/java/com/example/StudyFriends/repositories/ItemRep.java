package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRep extends JpaRepository<Item, Long> {
    @Query("""
    SELECT i
    FROM Item i
    LEFT JOIN PlayerItem pi
        ON pi.item.id = i.id
        AND pi.player.id = :playerId
    WHERE pi.id IS NULL
""")
    List<Item> findItemsNotOwnedByPlayer(@Param("playerId") Long playerId);
}
