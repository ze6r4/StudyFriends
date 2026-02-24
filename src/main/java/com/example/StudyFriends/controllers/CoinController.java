package com.example.StudyFriends.controllers;

import com.example.StudyFriends.services.CoinService;
import com.example.StudyFriends.services.PlayerService;
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
    private final PlayerService playerService;

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
        return ResponseEntity.ok(Map.of("coins", balance));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCoins(@RequestParam int amount,
                                      HttpSession session) {

        Long userId = getUserId(session);

        if (amount <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Сумма должна быть больше 0"));
        }

        coinService.addCoins(userId, amount);

        return ResponseEntity.ok(Map.of("message", "Монеты начислены"));
    }

    @PostMapping("/spend")
    public ResponseEntity<?> spendCoins(@RequestParam int amount,
                                        HttpSession session) {

        Long userId = getUserId(session);

        if (amount <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Сумма должна быть больше 0"));
        }

        coinService.spendCoins(userId, amount);

        return ResponseEntity.ok(Map.of("message", "Монеты списаны"));
    }

    @PostMapping("/set")
    public ResponseEntity<?> setBalance(@RequestParam int amount,
                                        HttpSession session) {

        Long userId = getUserId(session);

        if (amount < 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Баланс не может быть отрицательным"));
        }

        coinService.setBalance(userId, amount);

        return ResponseEntity.ok(Map.of("message", "Баланс обновлён"));
    }
}