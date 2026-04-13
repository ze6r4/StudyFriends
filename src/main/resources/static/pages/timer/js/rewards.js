import { getSkillStages, getFriendLvls } from '../../../shared/api.js';

let SKILL_STAGES = [];
let FRIEND_LVLS = {};

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function getStageByLevel(level) {
    return SKILL_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel);
}

// ==================== ГЛАВНАЯ ====================
export async function showRewards(rewards, skillData, friendData) {
    SKILL_STAGES = await getSkillStages();
    FRIEND_LVLS = await getFriendLvls();

    const modal = document.getElementById('rewardsModal');
    modal.classList.remove('hidden');

    // 💰 монеты
    document.getElementById('coinsSkill').textContent = rewards.coinsFromSkill;
    document.getElementById('coinsFriend').textContent = rewards.coinsFromFriendship;
    document.getElementById('coinsSession').textContent = rewards.coinsFromSession;

    const total =
        rewards.coinsFromSkill +
        rewards.coinsFromFriendship +
        rewards.coinsFromSession;

    document.getElementById('coinsTotal').textContent = total + ' 🪙';

    // ===== НАВЫК =====
    await animateProgress({
        fillId: 'skillProgress',
        levelId: 'skillLevel',
        maxXpId: 'skillMaxXp',

        extraUpdate: (lvl) => {
            const stage = getStageByLevel(lvl);
            if (stage) {
                document.getElementById('skillStage').textContent = stage.name;
            }
        },

        startLevel: skillData.level,
        startExp: skillData.expInCurrentLevel ?? 0,

        endLevel: rewards.skillReward.skillNewLvl,
        endExp: rewards.skillReward.skillExpOfLvl ?? 0,

        getMaxXp: (lvl) => getStageByLevel(lvl)?.xpPerLevel ?? 1,
        finalMaxXp: rewards.skillReward.skillXpToNext ?? 1
    });

    // ===== ДРУЖБА =====
    await animateProgress({
        fillId: 'friendProgress',
        levelId: 'friendLevel',
        maxXpId: 'friendMaxXp',

        extraUpdate: (lvl) => {
            const data = FRIEND_LVLS[lvl];
            if (!data) return;

            const bonusEl = document.getElementById('friendBonus');
            if (bonusEl) {
                bonusEl.textContent = `+${Math.round(data.coinsBonus * 100)}%`;
            }
        },

        startLevel: friendData.friendshipLvl,
        startExp: friendData.expInCurrentLevel ?? 0,

        endLevel: rewards.friendReward.friendshipNewLvl,
        endExp: rewards.friendReward.friendshipExpOfLvl ?? 0,

        getMaxXp: (lvl) => FRIEND_LVLS[lvl]?.totalExpForLvl ?? 1,
        finalMaxXp: rewards.friendReward.friendXpToNext ?? 1
    });
}

// ==================== УНИВЕРСАЛЬНАЯ АНИМАЦИЯ ====================
async function animateProgress(config) {
    const {
        fillId,
        levelId,
        maxXpId,
        extraUpdate,

        startLevel,
        startExp,

        endLevel,
        endExp,

        getMaxXp,
        finalMaxXp
    } = config;

    const fill = document.getElementById(fillId);
    const levelEl = document.getElementById(levelId);
    const maxXpEl = document.getElementById(maxXpId);

    let currentLevel = startLevel;
    let currentExp = startExp ?? 0;

    levelEl.textContent = currentLevel;

    let maxXp = getMaxXp(currentLevel);
    maxXpEl.textContent = Math.round(maxXp);

    extraUpdate?.(currentLevel);

    // 👉 стартовый процент
    let currentPercent = maxXp > 0 ? (currentExp / maxXp) * 100 : 0;
    fill.style.width = currentPercent + '%';

    await delay(300);

    const leveledUp = startLevel !== endLevel;

    // ===== LEVEL UP =====
    while (currentLevel < endLevel) {
        await animateBar(fill, currentPercent, 100);

        currentLevel++;
        levelEl.textContent = currentLevel;

        maxXp = getMaxXp(currentLevel);
        maxXpEl.textContent = Math.round(maxXp);

        extraUpdate?.(currentLevel);

        await delay(200);

        fill.style.width = '0%';
        currentPercent = 0;
    }

    // ===== ФИНАЛ =====
    const finalXp = finalMaxXp ?? getMaxXp(endLevel);
    const finalPercent = finalXp > 0 ? (endExp / finalXp) * 100 : 0;

    maxXpEl.textContent = Math.round(finalXp);

    const fromPercent = leveledUp ? 0 : currentPercent;

    await animateBar(fill, fromPercent, finalPercent);
}

// ==================== АНИМАЦИЯ ====================
function animateBar(element, from, to) {
    return new Promise(resolve => {
        let current = from;

        const step = () => {
            const diff = to - current;

            if (Math.abs(diff) < 0.5) {
                element.style.width = to + '%';
                resolve();
                return;
            }

            current += diff * 0.15;

            element.style.width = current + '%';
            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    });
}