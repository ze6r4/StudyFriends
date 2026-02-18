package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Character;
import lombok.Data;

@Data
public class CharacterDto {

    private Long id;
    private String name;
    private String description;
    private String dialoges;
    private Double chance;
    private String sitImage;
    private String standImage;
    private String studyImage;
    private String restImage;
    private String cardImage;

    public static CharacterDto fromEntity(Character character) {
        if (character == null) {
            return null;
        }

        CharacterDto response = new CharacterDto();

        response.setId(character.getId());
        response.setName(character.getName());
        response.setDescription(character.getDescription());
        response.setDialoges(character.getDialoges());
        response.setChance(character.getChance());

        response.setSitImage(character.getSitImage());
        response.setStandImage(character.getStandImage());
        response.setStudyImage(character.getStudyImage());
        response.setCardImage(character.getCardImage());
        response.setRestImage(character.getRestImage());

        return response;
    }
}
