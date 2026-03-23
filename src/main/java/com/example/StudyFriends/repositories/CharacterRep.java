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
    WHERE c NOT IN (
        SELECT f.character
        FROM Friend f
        WHERE f.player.id = :playerId
    )
""")
    //персонажи которые не друзья для игрока (не получены)
    public List<Character> getCharactersNotFriends(@Param("playerId") Long playerId);
}
