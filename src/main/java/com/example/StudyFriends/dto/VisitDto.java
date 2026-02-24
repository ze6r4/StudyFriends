package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.FriendVisit;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VisitDto {
    private Long id;
    private Long playerFriendId;
    private String friendAction;
    private Long friendPosTypeId;

    public static VisitDto fromEntity(FriendVisit visit) {

        VisitDto dto = new VisitDto();
        if (visit == null) {
            return null;
        }
        dto.id = visit.getId();
        if (visit.getPlayerFriend() != null) {
            dto.playerFriendId = visit.getPlayerFriend().getId();
        }
        if (visit.getFriendAction() != null) {
            dto.friendAction = visit.getFriendAction();
        }
        if (visit.getFriendPosType() != null) {
            dto.friendPosTypeId = visit.getFriendPosType().getId();
        }
        return dto;
    }
}
