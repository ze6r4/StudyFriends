package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Direction;
import com.example.StudyFriends.model.FriendVisit;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VisitDto {
    private Long id;
    private Long playerFriendId;
    private Action friendAction;
    private Direction direction;
    private Double x;
    private Double y;
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
        if (visit.getDirection() != null) {
            dto.direction = visit.getDirection();
        }
        if (visit.getX() != null) {
            dto.x = visit.getX();
        }
        if (visit.getY() != null) {
            dto.y = visit.getY();
        }
        return dto;
    }
}
