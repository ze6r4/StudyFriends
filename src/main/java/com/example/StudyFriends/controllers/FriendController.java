package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.FriendDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Character;
import com.example.StudyFriends.model.Friend;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.services.CharacterService;
import com.example.StudyFriends.services.FriendService;
import com.example.StudyFriends.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FriendController {
    @Autowired
    private FriendService friendService;
    @Autowired
    private CharacterService characterService;
    @Autowired
    private PlayerService playerService;

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
    public ResponseEntity<?> getFriendById(@RequestParam Long friendId) {
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
            if (dto.getExpInCurrentLevel() != null) {
                friend.setExpInCurrentLevel(dto.getExpInCurrentLevel());
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

    @PostMapping("/friend/{playerId}")
    public ResponseEntity<?> addFriendByCharacter(@PathVariable Long playerId, @RequestParam Long characterId){
        try{
            Character character = characterService.getCharacterById(characterId).orElseThrow();
            Player player = playerService.getPlayerById(playerId).orElseThrow();
            Friend friend = new Friend();
            friend.setCharacter(character);
            friend.setPlayer(player);
            friend.setFriendshipLvl(0);
            friend.setExpInCurrentLevel(0.0);
            friend.setIsFavourite(false);
            Friend newFriend = friendService.addFriend(friend);
            return ResponseEntity.ok(FriendDto.fromEntity(newFriend));
        }catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Ошибка: " + ex.getMessage());
        }

    }


}
