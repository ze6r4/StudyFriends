package com.example.StudyFriends.services;

import com.example.StudyFriends.exceptions.ConflictException;
import com.example.StudyFriends.exceptions.InvalidCredentialsException;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.repositories.PlayerRep;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@AllArgsConstructor
@Service
public class PlayerService {

    private PasswordEncoder passwordEncoder;

    private final PlayerRep playerRep;

    @Transactional
    public Player registerPlayer(String username, String email, String rawPassword) {
        // Проверяем, не существует ли пользователь
        if (playerRep.findByName(username).isPresent()) {
            throw new ConflictException("Никнейм уже занят");
        }

        // Хешируем пароль
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Создаем и сохраняем пользователя
        Player user = new Player();
        user.setName(username);
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setCoins(0);

        return playerRep.save(user);
    }


    public Player authenticate(String username, String rawPassword) {

        Player player = playerRep.findByName(username)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(rawPassword, player.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return player;
    }



    public Player addPlayer(Player player) {
        return playerRep.save(player);
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRep.findById(id);
    }
}
