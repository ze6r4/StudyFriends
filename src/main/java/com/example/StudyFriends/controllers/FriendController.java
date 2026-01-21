package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.FriendDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.services.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class FriendController {
    @Autowired
    private FriendService friendService;

    @GetMapping("/friends")
    public ResponseEntity<?> getFriendsOfPlayer(@RequestParam Long playerId) {
        try{
            List<Friend> friends = friendService.getAllFriendsOfPlayer(playerId);
            List<FriendDto> response = friends.stream()
                    .map(FriendDto::fromEntity)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }
    @GetMapping("/friend")
    public ResponseEntity<?> getFriendOfPlayer(@RequestParam Long friendId) {
        try{
            Friend friend = friendService.getFriendById(friendId).get();
            return ResponseEntity.ok(FriendDto.fromEntity(friend));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }
    }
    @PatchMapping("/friend/{id}")
    public ResponseEntity<?> editFriend(@PathVariable Long id, @RequestBody FriendDto dto) {
        //НЕ МЕНЯЕТ АЙДИШНИКИ
        try {
            Friend friend = friendService.getFriendById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Friend", id));

            if (dto.getFriendshipLvl() != null) {
                friend.setFriendshipLvl(dto.getFriendshipLvl());
            }
            if(dto.getIsFavourite()!=null){
                friend.setIsFavourite(dto.getIsFavourite());
            }
            // Сохраняем обновленную сессию
            Friend updatedFriend = friendService.updateFriend(friend);

            // Преобразуем в DTO для ответа
            FriendDto responseDto = FriendDto.fromEntity(updatedFriend);

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
