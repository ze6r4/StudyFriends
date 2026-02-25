package com.example.StudyFriends.controllers;


import com.example.StudyFriends.dto.PlayerDto;
import com.example.StudyFriends.dto.UserDto;
import com.example.StudyFriends.exceptions.ResourceNotFoundException;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.services.PlayerService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api")

public class AuthController {

    @Autowired
    private PlayerService playerService;

    private Long getUserId(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            throw new RuntimeException("Не авторизован");
        }
        return userId;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody UserDto user,
            HttpSession session
    ) {
        Player player = playerService.registerPlayer(
                user.getName(),
                user.getEmail(),
                user.getPassword()
        );

        session.setAttribute("USER_ID", player.getId());

        return ResponseEntity.ok(
                Map.of("message", "Регистрация успешна")
        );
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto user, HttpSession session) {

        Player player = playerService.authenticate(
                user.getName(),
                user.getPassword()
        );

        session.setAttribute("USER_ID", player.getId());

        return ResponseEntity.ok(
                Map.of("message", "Успешный вход")
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Long userId = getUserId(session);

        Player player = playerService.getPlayerById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        return ResponseEntity.ok(PlayerDto.fromEntity(player));
    }

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }

}
