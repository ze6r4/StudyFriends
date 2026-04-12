import { getSkillStages,postRewards } from '../../../shared/api.js';

let SKILL_STAGES = [];

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function getStageByLevel(level) {
    return SKILL_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel);
}

// ==================== ОСНОВНОЙ МЕТОД ====================
export async function showRewards(session) {
    const modal = document.getElementById('rewardsModal');
    modal.classList.remove('hidden');
    session = await postRewards(session);

    // загрузка стадий
    if (SKILL_STAGES.length === 0) {
        SKILL_STAGES = await getSkillStages();
    }

    const skill = session.skillReward;
    const friend = session.friendReward;

    // монеты
    document.getElementById('coinsSkill').textContent = session.coinsFromSkill;
    document.getElementById('coinsFriend').textContent = session.coinsFromFriendship;
    document.getElementById('coinsSession').textContent = session.coinsFromSession;

    const total = session.coinsFromSkill + session.coinsFromFriendship + session.coinsFromSession;
    document.getElementById('coinsTotal').textContent = total;

    await animateSkill(skill);
    await animateFriend(friend);
}

// ==================== НАВЫК ====================
async function animateSkill(skill) {
    const fill = document.getElementById('skillProgress');
    const levelEl = document.getElementById('skillLevel');
    const maxXpEl = document.getElementById('skillMaxXp');
    const stageEl = document.getElementById('skillStage');

    let currentLevel = parseInt(levelEl.textContent) || 1;

    while (currentLevel < skill.skillNewLvl) {
        const stage = getStageByLevel(currentLevel);

        stageEl.textContent = stage.name;
        maxXpEl.textContent = stage.xpPerLevel;

        await animateBar(fill, 100);

        currentLevel++;
        levelEl.textContent = currentLevel;

        await delay(300);

        fill.style.width = '0%';
    }

    // финальный уровень
    const finalStage = getStageByLevel(skill.skillNewLvl);

    stageEl.textContent = finalStage.name;
    maxXpEl.textContent = Math.round(skill.skillXpToNext);

    const percent = (skill.skillExpOfLvl / skill.skillXpToNext) * 100;

    await animateBar(fill, percent);
}

// ==================== ДРУЖБА ====================
async function animateFriend(friend) {
    const fill = document.getElementById('friendProgress');
    const levelEl = document.getElementById('friendLevel');
    const maxXpEl = document.getElementById('friendMaxXp');

    let currentLevel = parseInt(levelEl.textContent) || 1;

    while (currentLevel < friend.friendshipNewLvl) {
        await animateBar(fill, 100);

        currentLevel++;
        levelEl.textContent = currentLevel;

        await delay(300);
    }

    maxXpEl.textContent = Math.round(friend.friendXpToNext);

    const percent = (friend.friendshipExpOfLvl / friend.friendXpToNext) * 100;

    await animateBar(fill, percent);
}

// ==================== АНИМАЦИЯ ====================
function animateBar(element, targetPercent) {
    return new Promise(resolve => {


        let current = 0;

        const step = () => {
            current += 2;

            if (current >= targetPercent) {
                element.style.width = targetPercent + '%';
                resolve();
                return;
            }

            element.style.width = current + '%';
            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    });
}

// ==================== ЗАКРЫТИЕ ====================
