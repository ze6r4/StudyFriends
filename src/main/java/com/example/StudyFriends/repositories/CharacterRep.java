package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Character;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CharacterRep extends JpaRepository<Character,Long> {

    @Query("""
    SELECT c
    FROM Character c
    LEFT JOIN Friend f
        ON c.id = f.character.id
    WHERE f.player.id = :playerId
      AND f.id IS NULL
""")
    //персонажи которые не друзья для игрока (не получены)
    public List<Character> getCharactersNotFriends(@Param("playerId") Long playerId);
}
