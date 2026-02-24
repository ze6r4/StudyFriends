package com.example.StudyFriends.controllers;

import com.example.StudyFriends.services.CoinService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/coins")
public class CoinController {

    private final CoinService coinService;

    private Long getUserId(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");

        if (userId == null) {
            throw new RuntimeException("Не авторизован");
        }

        return userId;
    }

    @GetMapping
    public ResponseEntity<?> getBalance(HttpSession session) {
        Long userId = getUserId(session);
        int balance = coinService.getBalance(userId);

        return ResponseEntity.ok(
                Map.of("coins", balance)
        );
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCoins(@RequestParam int amount,
                                      HttpSession session) {

        Long userId = getUserId(session);

        coinService.addCoins(userId, amount);

        return ResponseEntity.ok(
                Map.of("message", "Монеты начислены")
        );
    }

    @PostMapping("/spend")
    public ResponseEntity<?> spendCoins(@RequestParam int amount,
                                        HttpSession session) {

        Long userId = getUserId(session);

        coinService.spendCoins(userId, amount);

        return ResponseEntity.ok(
                Map.of("message", "Монеты списаны")
        );
    }
}