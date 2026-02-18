package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.ItemDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Item;
import com.example.StudyFriends.model.PlayerItem;
import com.example.StudyFriends.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ItemController {
    @Autowired
    private ItemService itemService;

    @GetMapping("/items/{id}")
    public ResponseEntity<ItemDto> getPlayerItem(@PathVariable Long id) {
        return itemService.getPlayerItemById(id)
                .map(ItemDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/items")
    public ResponseEntity<?> getItemsOfPlayer(@RequestParam Long playerId) {
        try{
            List<PlayerItem> items = itemService.getAllItemsOfPlayer(playerId);
            List<ItemDto> response = items.stream()
                    .map(ItemDto::fromEntity)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }
    @PatchMapping("/items/{id}")
    public ResponseEntity<?> editItem(@PathVariable Long id, @RequestBody ItemDto dto) {
        //НЕ МЕНЯЕТ АЙДИШНИКИ
        try {
            PlayerItem playerItem = itemService.getPlayerItemById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("PlayerItem", id));
            Item item = itemService.getItemById(dto.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Item", id));

            playerItem.setInRoom(dto.getInRoom());
            playerItem.setIsBought(dto.getIsBought());

            if(dto.getItemName()!=null){
                item.setName(dto.getItemName());
            }
            if(dto.getItemPrice()!=null){
                item.setPrice(dto.getItemPrice());
            }
            if(dto.getItemImage()!=null){
                item.setImage(dto.getItemImage());
            }
            if(dto.getItemCard()!=null){
                item.setImageCard(dto.getItemCard());
            }

            // Сохраняем обновленную сессию
            PlayerItem updatedPlayerItem = itemService.updatePlayerItem(playerItem);
            Item updatedItem = itemService.updateItem(item);

            // Преобразуем в DTO для ответа
            // updatedItem находится по айди предмета и там добавляется
            ItemDto responseDto = ItemDto.fromEntity(updatedPlayerItem);

            return ResponseEntity.ok(responseDto);

        } catch (ResourceNotFoundException ex) {
            // Обработка кастомной ошибки
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }

}
