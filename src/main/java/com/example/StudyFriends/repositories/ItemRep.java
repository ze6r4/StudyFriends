package com.example.StudyFriends.repositories;

import com.example.StudyFriends.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRep extends JpaRepository<Item, Long> {
}
