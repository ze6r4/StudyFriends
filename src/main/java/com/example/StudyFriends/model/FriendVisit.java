package com.example.StudyFriends.model;

import com.example.StudyFriends.dto.Action;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "friend_action")
    private Action friendAction;

    @Enumerated(EnumType.STRING)
    private Direction direction;

    private Double x;
    private Double y;

}