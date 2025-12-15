package com.example.StudyFriends.services;

import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.repositories.FriendRep;
import com.example.StudyFriends.repositories.PlayerRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FriendService {
    private final FriendRep friendRep;
    private final PlayerRep playerRep;


    public Optional<Friend> getFriendById(Long id){
        return friendRep.findById(id);
    }
    public List<Friend> getAllFriendsOfPlayer(Long playerId){
        Player player = playerRep.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player", playerId));
        return player.getFriends();
    }
}
