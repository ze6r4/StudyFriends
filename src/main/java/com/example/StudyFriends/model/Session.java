package com.example.StudyFriends.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "playersessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player playerId;

    @ManyToOne
    @JoinColumn(name = "player_friend_id", nullable = false)
    private Friend friend;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "work_time")
    private Integer workTime;

    @Column(name = "rest_time")
    private Integer restTime;

    @Column(name = "cycles")
    private Integer cycles;

    @Column(nullable = false)
    private Boolean completed;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public Integer getTotal(){
        return (workTime+restTime)*cycles;
    }
}