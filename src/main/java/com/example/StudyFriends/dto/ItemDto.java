package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Item;
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

    // из сущности Item
    private String itemName;
    private String itemImage;
    private String itemCard;
    private Integer itemPrice;

    public static ItemDto fromEntity(PlayerItem playerItem) {
        ItemDto dto = new ItemDto();
        dto.setId(playerItem.getId());
        dto.setInRoom(playerItem.getInRoom());

        // Получаем ID связанных сущностей
        if (playerItem.getPlayer() != null) {
            dto.setPlayerId(playerItem.getPlayer().getId());
        }

        if (playerItem.getItem() != null) {
            dto.setItemId(playerItem.getItem().getId());

            dto.setItemName(playerItem.getItem().getName());
            dto.setItemImage(playerItem.getItem().getImage());
            dto.setItemPrice(playerItem.getItem().getPrice());
            dto.setItemCard(playerItem.getItem().getImageCard());
        }

        return dto;
    }
    public static ItemDto fromEntity(Item item) {
        ItemDto dto = new ItemDto();

        if (item!= null) {
            dto.setItemId(item.getId());

            dto.setItemName(item.getName());
            dto.setItemImage(item.getImage());
            dto.setItemPrice(item.getPrice());
            dto.setItemCard(item.getImageCard());
        }

        return dto;
    }
}