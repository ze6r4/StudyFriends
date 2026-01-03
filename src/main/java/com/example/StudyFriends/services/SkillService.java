package com.example.StudyFriends.services;

import com.example.StudyFriends.dto.SkillDto;
import com.example.StudyFriends.model.Skill;
import com.example.StudyFriends.repositories.SessionRep;
import com.example.StudyFriends.repositories.SkillRep;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SkillService {
    private final SkillRep skillRep;
    private final SessionRep sessionRep;

    public Skill updateSkill(Skill skill) {return skillRep.save(skill);}
    public Skill addSkill(Skill skill){
        return skillRep.save(skill);
    }
    public Optional<Skill> getSkillById(Long id){
        return skillRep.findById(id);
    }
    public List<Skill> getAllSkillsOfPlayer(Long playerId) {
        // Проверки на существование?
        return skillRep.findSkillsByPlayerId(playerId);
    }
    @Transactional(readOnly = true)
    public List<SkillDto> getFullSkills(Long playerId) {
        List<Skill> allSkills = skillRep.findSkillsByPlayerId(playerId);
        List<Long> usedSkillIds = sessionRep.findUsedSkillIds(playerId);

        // 3️⃣ Преобразуем в DTO с usedInSessions
        return allSkills.stream()
                .map(skill -> new SkillDto(
                        skill.getId(),
                        skill.getId(),
                        skill.getName(),
                        skill.getProgress(),
                        skill.getIsActive(),
                        usedSkillIds.contains(skill.getId())
                ))
                .collect(Collectors.toList());
    }
    public void deleteSkill(Long id) {
        skillRep.deleteById(id);
    }
}
