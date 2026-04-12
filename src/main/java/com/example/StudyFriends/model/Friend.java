package com.example.StudyFriends.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "playerfriends")
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private Character character;

    @Column(name = "friendship_lvl", nullable = false)
    private Integer friendshipLvl;

    @Column(name = "exp_amount")
    private Double expInCurrentLevel;

    @Column(name = "is_favourite", nullable = false)
    private Boolean isFavourite;

    @OneToMany(mappedBy = "friend")
    private List<Session> sessions = new ArrayList<>();

    @OneToMany(mappedBy = "playerFriend")
    private List<FriendVisit> visits = new ArrayList<>();
}