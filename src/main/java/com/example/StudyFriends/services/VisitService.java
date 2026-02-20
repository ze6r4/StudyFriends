package com.example.StudyFriends.services;

import com.example.StudyFriends.model.FriendVisit;
import com.example.StudyFriends.repositories.FriendVisitRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class VisitService {
    private final FriendVisitRep visitRep;
    public List<FriendVisit> getAllVisitors(Long playerFriendId){
        return visitRep.findVisitorsOfPlayerFriends(playerFriendId);
    }

}
