package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.PlayerItem;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemDto {
    private Long id;
    private Long playerId;
    private Long itemId;
    private Boolean inRoom;
    private Boolean isBought;

    // Можно также включить дополнительную информацию о предмете
    private String itemName;
    private String itemImage;
    private String itemCard;
    private Integer itemPrice;

    public static ItemDto fromEntity(PlayerItem playerItem) {
        ItemDto dto = new ItemDto();
        dto.setId(playerItem.getId());
        dto.setInRoom(playerItem.getInRoom());
        dto.setIsBought(playerItem.getIsBought());

        // Получаем ID связанных сущностей
        if (playerItem.getPlayer() != null) {
            dto.setPlayerId(playerItem.getPlayer().getId());
        }

        if (playerItem.getItem() != null) {
            dto.setItemId(playerItem.getItem().getId());
            // Дополнительная информация о предмете
            dto.setItemName(playerItem.getItem().getName());
            dto.setItemImage(playerItem.getItem().getImage());
            dto.setItemPrice(playerItem.getItem().getPrice());
            dto.setItemCard(playerItem.getItem().getImageCard());
        }

        return dto;
    }
}