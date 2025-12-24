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
@Table(name = "characters")
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(columnDefinition = "JSON", nullable = false)
    private String dialoges;

    @Column(nullable = false)
    private Double chance;

    @Column(name = "sit_image", nullable = false)
    private String sitImage;

    @Column(name = "stand_image", nullable = false)
    private String standImage;

    @Column(name = "study_image", nullable = false)
    private String studyImage;

    @Column(name = "card_image")
    private String cardImage;

    @OneToMany(mappedBy = "character")
    private List<Friend> playerFriends = new ArrayList<>();
}