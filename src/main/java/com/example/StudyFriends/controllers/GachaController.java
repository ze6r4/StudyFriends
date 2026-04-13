package com.example.StudyFriends.controllers;

import com.example.StudyFriends.config.RewardConfig;
import com.example.StudyFriends.dto.CharacterDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.services.CharacterService;
import com.example.StudyFriends.services.CoinService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class GachaController {

    @Autowired
    private final CharacterService characterService;
    @Autowired
    private final CoinService coinService;
    private static final Random RANDOM = new Random();

    @GetMapping("/gacha/{playerId}")
    public ResponseEntity<?> rollGacha(@PathVariable Long playerId) {
        try {
            CharacterDto character = rollGachaInternal(playerId);
            return ResponseEntity.ok(character);

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка гачи " + e.getMessage());
        }
    }

        // 🔥 ВСЯ ЛОГИКА В ОДНОЙ ТРАНЗАКЦИИ
    @Transactional
    public CharacterDto rollGachaInternal(Long playerId) {

        List<CharacterDto> characterDtoList = characterService
                .getCharactersNotFriends(playerId)
                .stream()
                .map(CharacterDto::fromEntity)
                .toList();

        if (characterDtoList.isEmpty()) {
            throw new ResourceNotFoundException("Нет доступных персонажей :(");
        }

        int randomIndex = getRandomCharacterIndex(characterDtoList.size());
        if(randomIndex == -1) {
            throw new ResourceNotFoundException("Пустой список");
        }
        coinService.spendCoins(playerId, RewardConfig.GACHA_PRICE);
        return characterDtoList.get(randomIndex);
    }

    private int getRandomCharacterIndex(int size) {
        if (size == 0) {
            return -1;
        }
        return RANDOM.nextInt(size);
    }
}
