package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.FriendVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendVisitRep extends JpaRepository<FriendVisit, Integer> {
    @Query("SELECT f FROM FriendVisit f WHERE f.playerFriend.id = :playerFriendId")
    Optional<FriendVisit> findVisitorOfPlayerFriends(@Param("playerFriendId") Long playerFriendId);

    @Query("""
    SELECT fv
    FROM FriendVisit fv
    LEFT JOIN Friend f
        ON fv.playerFriend.id = f.id
    WHERE f.player.id = :playerId
""")
    List<FriendVisit> findVisitorsOfPlayer(@Param("playerId") Long playerId);

    @Modifying
    @Transactional
    @Query("DELETE FROM FriendVisit fv WHERE fv.playerFriend.id = :friendId")
    void deleteByPlayerFriendId(@Param("friendId") Long friendId);
}
