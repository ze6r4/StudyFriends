import { getSkillStages, getFriendLvls } from '../../../shared/api.js';

let SKILL_STAGES = [];
let FRIEND_LVLS = {};
const SKILL_ICON_PATH = '/assets/images/other/';

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function getStageByLevel(level) {
    return SKILL_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel);
}

// ==================== ГЛАВНАЯ ====================
export async function showFinalNotes(rewards, skillData, friendData) {
    SKILL_STAGES = await getSkillStages();
    FRIEND_LVLS = await getFriendLvls();

    const notes = document.getElementById('notesContent');
    const confirmBtn = document.getElementById('confirmNotesBtn');
    const title = document.getElementById('notesHeader');

    title.innerHTML = `<h1>финальные правки</h1>`;

    confirmBtn.classList.remove('hidden');

    confirmBtn.onclick = async () => {
        confirmBtn.classList.add('hidden');

        const total =
            rewards.coinsFromSkill +
            rewards.coinsFromFriendship +
            rewards.coinsFromSession;

        // ===== ВСТАВКА ОРИГИНАЛЬНОГО UI =====
        title.innerHTML = `<h1>награды</h1>`;
        notes.innerHTML = `
            <div class="rewards-inline">
                <!-- НАВЫК -->

                <div class="reward-block">
                    Уровень навыка
                    <div class="skill-header">
                        <img id="skillIcon" class="skill-icon-top" />
                        <div class="stage-label" id="skillStage"></div>
                    </div>
                    <div class="progress-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" id="skillProgress"></div>
                        </div>

                        <div class="progress-labels">
                            <span id="skillLevel">1 ур</span>
                            <span id="skillXp">0 / 100 exp</span>
                        </div>
                    </div>
                </div>

                <!-- ДРУЖБА -->

                <div class="reward-block">
                Уровень дружбы
                    <div class="progress-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" id="friendProgress"></div>
                        </div>

                        <div class="progress-labels">
                            <span id="friendLevel">1 ур</span>
                            <span id="friendXp">0 / 100 exp</span>
                        </div>
                    </div>
                </div>

                <!-- МОНЕТЫ -->
                <div class="coins-block">
                    <div class="coins-row">
                        <span>Бонус навыка (+${rewards.skillCoinBonus * 100}%)</span>
                        <span id="coinsSkill">+${rewards.coinsFromSkill}</span>
                    </div>

                    <div class="coins-row">
                        <span>Бонус дружбы (+${rewards.friendCoinBonus*100}%)</span>
                        <span id="coinsFriend">+${rewards.coinsFromFriendship}</span>
                    </div>

                    <div class="coins-row">
                        <span>Сессия (${Math.round(rewards.totalMinutes)}мин)</span>
                        <span id="coinsSession">+${rewards.coinsFromSession}</span>
                    </div>

                    <div class="divider"></div>

                    <div class="coins-row total">
                        <span>ИТОГО</span>
                        <span class="coins-total-value">
                            <span id="coinsTotal">123</span>
                            <span class="coin-emoji"> 🪙</span>
                        </span>
                    </div>
                </div>

            </div>
        `;

        // блокируем заметки
        notes.setAttribute("contenteditable", "false");
        notes.classList.add("rewards-mode");

        // анимация исчезновения
        notes.classList.add("notes-fade");
        setTimeout(() => notes.classList.remove("notes-fade"), 1000);
        const skillStage = getStageByLevel(skillData.level);
        const skillIcon = `${SKILL_ICON_PATH}${skillStage.name}_icon.png`;

        // ===== ДАННЫЕ =====
        document.getElementById('skillIcon').src = skillIcon;
        document.getElementById('coinsSkill').textContent = '+'+rewards.coinsFromSkill;
        document.getElementById('coinsFriend').textContent = '+'+rewards.coinsFromFriendship;
        document.getElementById('coinsSession').textContent = '+'+rewards.coinsFromSession;

        document.getElementById('coinsTotal').textContent = total;

        // ===== АНИМАЦИЯ ПРОГРЕССА (КАК БЫЛО) =====
        await animateProgress({
            fillId: 'skillProgress',
            levelId: 'skillLevel',
            xpId: 'skillXp',

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

        await animateProgress({
            fillId: 'friendProgress',
            levelId: 'friendLevel',
            xpId: 'friendXp',

            startLevel: friendData.friendshipLvl,
            startExp: friendData.expInCurrentLevel ?? 0,

            endLevel: rewards.friendReward.friendshipNewLvl,
            endExp: rewards.friendReward.friendshipExpOfLvl ?? 0,

            getMaxXp: (lvl) => FRIEND_LVLS[lvl]?.totalExpForLvl ?? 1,
            finalMaxXp: rewards.friendReward.friendXpToNext ?? 1
        });
    };
}

// ==================== АНИМАЦИЯ (без изменений) ====================
async function animateProgress(config) {
    const {
        fillId,
        levelId,
        xpId,
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
    const xpEl = document.getElementById(xpId);

    let currentLevel = startLevel;
    let currentExp = startExp ?? 0;

    let maxXp = getMaxXp(currentLevel);

    levelEl.textContent = `${currentLevel} ур`;
    xpEl.textContent = `${currentExp} / ${Math.round(maxXp)} exp`;

    extraUpdate?.(currentLevel);

    const visualExp = currentExp === 0 ? 10 : currentExp;
    let percent = maxXp > 0 ? (visualExp / maxXp) * 100 : 0;

    fill.style.width = percent + '%';

    await delay(300);

    while (currentLevel < endLevel) {
        await animateBar(fill, percent, 100);

        currentLevel++;
        levelEl.textContent = `${currentLevel} ур`;

        maxXp = getMaxXp(currentLevel);
        currentExp = 0;

        xpEl.textContent = `${currentExp} / ${Math.round(maxXp)} exp`;

        extraUpdate?.(currentLevel);

        await delay(200);

        fill.style.width = '0%';
        percent = 0;
    }

    const finalXp = finalMaxXp ?? getMaxXp(endLevel);
    const finalPercent = finalXp > 0 ? (endExp / finalXp) * 100 : 0;

    xpEl.textContent = `${endExp} / ${Math.round(finalXp)} exp`;

    await animateBar(fill, percent, finalPercent);
}

function animateBar(element, from, to) {
    return new Promise(resolve => {
        let current = from;

        function step() {
            const diff = to - current;

            if (Math.abs(diff) < 0.5) {
                element.style.width = to + '%';
                resolve();
                return;
            }

            current += diff * 0.15;
            element.style.width = current + '%';

            requestAnimationFrame(step);
        }

        step();
    });
}