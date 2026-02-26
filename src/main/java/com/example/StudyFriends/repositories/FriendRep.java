package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRep extends JpaRepository<Friend,Long> {
    @Query("SELECT f FROM Friend f WHERE f.player.id = :playerId")
    List<Friend> findFriendsByPlayerId(@Param("playerId") Long playerId);

    @Query("SELECT f FROM Friend f WHERE f.id = :friendId")
    Optional<Friend> findFriend(@Param("friendId") Long friendId);

    @Query("""
    SELECT f
    FROM Friend f
    LEFT JOIN FriendVisit fv
        ON fv.playerFriend.id = f.id
    WHERE f.player.id = :playerId
      AND fv.id IS NULL
""")
    List<Friend> findFriendsNotVisitors(@Param("playerId") Long playerId);
}
