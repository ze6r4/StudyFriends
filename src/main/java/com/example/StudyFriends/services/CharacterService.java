package com.example.StudyFriends.services;

import com.example.StudyFriends.model.Character;
import com.example.StudyFriends.repositories.CharacterRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CharacterService {
    private final CharacterRep characterRep;
    public Optional<Character> getCharacterById(Long id){
        return characterRep.findById(id);
    }
    public Character updateCharacter(Character character){
        return characterRep.save(character);
    }
    public List<Character> getCharactersNotFriends(Long playerId) {
        return characterRep.getCharactersNotFriends(playerId);
    }
}
