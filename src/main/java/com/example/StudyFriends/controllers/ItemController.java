package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.ItemDto;
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

}
