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
@Table(name = "player")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Integer coins;

    @ManyToOne
    @JoinColumn(name = "appearance_id")
    private Appearance appearance;

    @OneToMany(mappedBy = "player",fetch = FetchType.EAGER)
    private List<Friend> friends = new ArrayList<>();

    @OneToMany(mappedBy = "player")
    private List<Skill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "player")
    private List<PlayerItem> items = new ArrayList<>();
}