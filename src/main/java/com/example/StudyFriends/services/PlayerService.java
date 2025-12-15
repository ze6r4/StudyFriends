package com.example.StudyFriends.services;

import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.repositories.PlayerRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class PlayerService {
    private final PlayerRep repository;

    public Player addPlayer(Player player) {
        return repository.save(player);
    }

    public Optional<Player> getPlayerById(Long id) {
        return repository.findById(id);
    }
}
