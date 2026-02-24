package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.FriendVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendVisitRep extends JpaRepository<FriendVisit, Integer> {
    @Query("SELECT f FROM FriendVisit f WHERE f.playerFriend.id = :playerFriendId")
    FriendVisit findVisitorOfPlayerFriends(@Param("playerFriendId") Long playerFriendId);

}
