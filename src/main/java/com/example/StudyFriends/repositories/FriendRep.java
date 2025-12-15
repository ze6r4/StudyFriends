package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRep extends JpaRepository<Friend,Long> {
}
