package com.example.StudyFriends.services;

import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.repositories.PlayerRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
public class CoinService {

    private final PlayerRep playerRep;

    @Transactional
    public void addCoins(Long userId, int amount) {
        if (amount <= 0) return;

        Player player = playerRep.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Игрок не найден"));

        player.setCoins(player.getCoins() + amount);
    }

    @Transactional
    public void spendCoins(Long userId, int amount) {

        if (amount <= 0) {
            throw new IllegalArgumentException("Некорректная сумма");
        }

        Player player = playerRep.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Игрок не найден"));

        if (player.getCoins() < amount) {
            throw new IllegalStateException("Недостаточно монет");
        }

        player.setCoins(player.getCoins() - amount);
    }

    public int getBalance(Long userId) {
        Player player = playerRep.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Игрок не найден"));

        return player.getCoins();
    }
    public void setBalance(Long userId, int amount) {
        Player player = playerRep.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        player.setCoins(amount);
        playerRep.save(player);
    }
}