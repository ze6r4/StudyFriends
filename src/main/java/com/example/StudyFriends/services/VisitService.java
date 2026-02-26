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
    public FriendVisit getVisitor(Long playerFriendId){
        return visitRep.findVisitorOfPlayerFriends(playerFriendId);
    }
    public FriendVisit addVisitor(FriendVisit visit){return visitRep.save(visit);}
    public void deleteVisitor(Long playerFriendId) {visitRep.deleteByFriendId(playerFriendId);}
    public List<FriendVisit> getVisitorsOfPlayer(Long playerId) {return visitRep.findVisitorsOfPlayer(playerId);}
}
