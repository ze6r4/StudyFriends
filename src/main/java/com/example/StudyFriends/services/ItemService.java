package com.example.StudyFriends.services;

import com.example.StudyFriends.model.Item;
import com.example.StudyFriends.model.PlayerItem;
import com.example.StudyFriends.repositories.ItemRep;
import com.example.StudyFriends.repositories.PlayerItemRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ItemService {
    private final ItemRep itemRep;
    private final PlayerItemRep playerItemRep;

    public Optional<Item> getItemById(Long id){
        return itemRep.findById(id);
    }
    public Item updateItem(Item item){
        return itemRep.save(item);
    }
    public PlayerItem updatePlayerItem(PlayerItem item){
        return playerItemRep.save(item);
    }
    public Optional<PlayerItem> getPlayerItemById(Long id){
        return playerItemRep.findById(id);
    }
    public List<PlayerItem> getAllItemsOfPlayer(Long playerId){
        return playerItemRep.findItemsByPlayerId(playerId);
    }

}
