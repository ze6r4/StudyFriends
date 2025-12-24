package com.example.StudyFriends.services;

import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.repositories.FriendRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FriendService {
    private final FriendRep friendRep;

    public Optional<Friend> getFriendById(Long id){
        return friendRep.findById(id);
    }
    public List<Friend> getAllFriendsOfPlayer(Long playerId){
        return friendRep.findFriendsByPlayerId(playerId);
    }
}
