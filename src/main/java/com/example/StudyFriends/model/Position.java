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
@Table(name = "postypes")
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PositionName name;

    @Column(nullable = false)
    private Double x;

    @Column(nullable = false)
    private Double y;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Direction direction;

    @OneToMany(mappedBy = "posType")
    private List<Item> items = new ArrayList<>();

    @OneToMany(mappedBy = "friendPosType")
    private List<FriendVisit> friendVisits = new ArrayList<>();
}