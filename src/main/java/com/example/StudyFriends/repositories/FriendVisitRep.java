package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.FriendVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendVisitRep extends JpaRepository<FriendVisit, Integer> {
    @Query("SELECT f FROM FriendVisit f WHERE f.playerFriend.id = :playerFriendId")
    FriendVisit findVisitorOfPlayerFriends(@Param("playerFriendId") Long playerFriendId);

    @Query("""
    SELECT fv
    FROM FriendVisit fv
    LEFT JOIN Friend f
        ON fv.playerFriend.id = f.id
    WHERE f.player.id = :playerId
""")
    List<FriendVisit> findVisitorsOfPlayer(@Param("playerId") Long playerId);

    @Query("DELETE FROM FriendVisit f WHERE f.playerFriend.id = :playerFriendId")
    void deleteByFriendId(@Param("playerFriendId") Long playerFriendId);
}
