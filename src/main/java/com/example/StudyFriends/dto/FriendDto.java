package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Friend;
import lombok.Data;

@Data
public class FriendDto {
    private Long id;
    private Long playerId;
    private Long characterId;
    private Double friendshipLvl;
    private Boolean isFavourite;

    private String name;
    private String description;
    private String standImage;

    public static FriendDto fromEntity(Friend friend) {
        FriendDto response = new FriendDto();
        response.setId(friend.getId());
        response.setCharacterId(friend.getCharacter() != null ? friend.getCharacter().getId() : null);
        response.setFriendshipLvl(friend.getFriendshipLvl());
        response.setIsFavourite(friend.getIsFavourite());
        response.setPlayerId(friend.getPlayer() != null ? friend.getPlayer().getId() : null);

        response.setName(friend.getCharacter() != null? friend.getCharacter().getName(): null);
        response.setDescription(friend.getCharacter() != null? friend.getCharacter().getDescription(): null);
        response.setStandImage(friend.getCharacter() != null? friend.getCharacter().getStandImage() : null);
        return response;
    }
}
