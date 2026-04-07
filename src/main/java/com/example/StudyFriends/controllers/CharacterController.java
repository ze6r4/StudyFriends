package com.example.StudyFriends.controllers;

import com.example.StudyFriends.dto.CharacterDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Character;
import com.example.StudyFriends.services.CharacterService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/characters")
@AllArgsConstructor
public class CharacterController {

    @Autowired
    private final CharacterService characterService;

    private static final Random RANDOM = new Random();

    @GetMapping("/random/{playerId}")
    public ResponseEntity<?> getRandomCharacter(@PathVariable Long playerId) {
        try {
            List<CharacterDto> characterDtoList = characterService.getCharactersNotFriends(playerId)
                    .stream()
                    .map(CharacterDto::fromEntity)
                    .toList();

            int randomIndex = getRandomCharacterIndex(characterDtoList.size());
            if(randomIndex == -1) {
                throw new ResourceNotFoundException("Пустой список");
            }
            CharacterDto randomCharacter = characterDtoList.get(randomIndex);
            return ResponseEntity.ok(randomCharacter);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }


    }
    private int getRandomCharacterIndex(int size) {
        if (size == 0) {
            return -1;
        }
        return RANDOM.nextInt(size);
    }


    @GetMapping("/{id}")
    public ResponseEntity<CharacterDto> getCharacter(@PathVariable Long id) {
        return characterService.getCharacterById(id)
                .map(CharacterDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PatchMapping("/character/{id}")
    public ResponseEntity<?> editCharacter(@PathVariable Long id, @RequestBody CharacterDto dto) {
        try {
            // Получаем существующую сессию
            Character character = characterService.getCharacterById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Session", id));

            // Обновляем базовые поля только если они переданы (не null)
            if (dto.getName() != null) {
                character.setName(dto.getName());
            }
            if (dto.getDescription() != null) {
                character.setDescription(dto.getDescription());
            }
            if (dto.getChance() != null) {
                character.setChance(dto.getChance());
            }
            if (dto.getDialoges() != null) {
                character.setDialoges(dto.getDialoges());
            }
            if(dto.getCardImage() != null) {
                character.setCardImage(dto.getCardImage());
            }
            if(dto.getSitImage() != null) {
                character.setSitImage(dto.getSitImage());
            }
            if(dto.getStandImage() != null) {
                character.setStandImage(dto.getStandImage());
            }
            if(dto.getStudyImage() != null){
                character.setStudyImage(dto.getStudyImage());
            }

            // Сохраняем обновленную сессию
            Character updatedCharacter = characterService.updateCharacter(character);

            // Преобразуем в DTO для ответа
            CharacterDto responseDto = CharacterDto.fromEntity(updatedCharacter);

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
