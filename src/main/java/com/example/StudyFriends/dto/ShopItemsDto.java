package com.example.StudyFriends.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ShopItemsDto {

    private List<ItemDto> owned;
    private List<ItemDto> available;

}