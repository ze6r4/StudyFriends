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
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String image;
    @Column(name = "image_card")
    private String imageCard;

    @Column(nullable = false)
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "pos_type")
    private Position posType;

    @OneToMany(mappedBy = "item")
    private List<PlayerItem> playerItems = new ArrayList<>();
}