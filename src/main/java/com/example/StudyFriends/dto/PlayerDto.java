package com.example.StudyFriends.dto;

import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.model.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerDto {
    private Long id;
    private String name;
    private String password;
    private String email;
    private Integer coins;
    private String role;
    public static PlayerDto fromEntity(Player player) {
        PlayerDto dto = new PlayerDto();
        if(player == null) {
            return dto;
        }
        dto.setId(player.getId());
        dto.setName(player.getName());
        dto.setPassword(player.getPassword());
        dto.setEmail(player.getEmail());
        dto.setCoins(player.getCoins());
        String roleString =player.getRole().toString();
        dto.setRole(roleString);
        return dto;
    }
    // геттер с логикой, автоматически распознается при конвертировании в json
    public boolean isDeveloper() {
        return UserRole.DEVELOPER.toString().equals(this.role);
    }
}
