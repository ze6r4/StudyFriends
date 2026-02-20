package com.example.StudyFriends.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "friendsvisit")
public class FriendVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_friend_id", nullable = false)
    private Friend playerFriend;

    @Column(name = "friend_action")
    private String friendAction;

    @ManyToOne
    @JoinColumn(name = "friend_pos_type")
    private Position friendPosType;
}