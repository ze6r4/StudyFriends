package com.example.StudyFriends.services;

import com.example.StudyFriends.model.Item;
import com.example.StudyFriends.model.Player;
import com.example.StudyFriends.model.PlayerItem;
import com.example.StudyFriends.repositories.ItemRep;
import com.example.StudyFriends.repositories.PlayerItemRep;
import com.example.StudyFriends.repositories.PlayerRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ItemService {
    private final ItemRep itemRep;
    private final PlayerItemRep playerItemRep;
    private final PlayerRep playerRep;

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
    @Transactional
    public void buyItem(Long playerId, Long itemId){

 //была проверка "уже куплено" удалила

        Player player = playerRep.findById(playerId).orElseThrow();
        Item item = itemRep.findById(itemId).orElseThrow();

        PlayerItem pi = new PlayerItem();
        pi.setPlayer(player);
        pi.setItem(item);
        pi.setInRoom(true);

        playerItemRep.save(pi);
    }
    public List<Item> getItemsNotOfPlayer(Long playerId){
        return itemRep.findItemsNotOwnedByPlayer(playerId);
    }
}
