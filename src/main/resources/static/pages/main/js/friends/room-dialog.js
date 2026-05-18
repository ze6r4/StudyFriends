import {
    getCharacterOfFriend,
    getFriend,
    getMe
} from '../../../../shared/api.js';
import {
    placementMode
} from './visit-transform.js';
const TYPE_SPEED = 22;

let player = null;
let isTyping = false;
let typingTimeout = null;

document.addEventListener("DOMContentLoaded", async () => {

    player = await getMe();

    createDialog();

    const roomCharacters =
        document.getElementById(
            "roomCharacters"
        );

    roomCharacters.addEventListener(
        "click",
        handleCharacterClick
    );
});

/* ================= CLICK ================= */

async function handleCharacterClick(e) {

    if (placementMode) {
        return;
    }

    const characterEl =
        e.target.closest(".room-character");

    if (!characterEl) return;

    const friendId =
        characterEl.dataset.friendId;

    if (!friendId) return;

    try {

        const [
            character,
            friend
        ] = await Promise.all([
            getCharacterOfFriend(friendId),
            getFriend(friendId)
        ]);

        if (!character || !friend) {
            return;
        }

        openDialog(
            character,
            friend
        );

    } catch (e) {

        console.error(
            "Ошибка загрузки диалога",
            e
        );
    }
}

/* ================= DIALOG ================= */

function createDialog() {

    const dialog =
        document.createElement("div");

    dialog.id = "novelDialog";

    dialog.innerHTML = `
        <div class="dialog-character">

            <img
                id="dialogCharacterImage"
                class="dialog-character-image"
                alt="character"
            >

        </div>

        <div class="dialog-inner">

            <div class="dialog-header">
                <div class="dialog-name"
                     id="dialogName">
                </div>
            </div>

            <div class="dialog-text"
                 id="dialogText">
            </div>

            <div class="dialog-next">
                нажмите чтобы закрыть ▼
            </div>

        </div>
    `;

    document.body.appendChild(dialog);

    dialog.addEventListener("click", closeDialog);
}
function processDialogText(text) {

    if (!text) return "";

    return text
        .replaceAll(
            "{playerName}",
            player?.name || "друг"
        );
}

function openDialog(
    character,
    friend
) {

    const dialog =
        document.getElementById(
            "novelDialog"
        );

    const dialogName =
        document.getElementById(
            "dialogName"
        );

    const dialogText =
        document.getElementById(
            "dialogText"
        );

    const characterImage =
        document.getElementById(
            "dialogCharacterImage"
        );

    dialog.classList.add("open");

    dialogName.textContent =
        character.name;

    dialogText.textContent = "";

    characterImage.src =
        `../../assets/images/characters/${character.standImage}.png`;

   const rawText =
       resolveDialog(
           character,
           friend
       );

   const processedText =
       processDialogText(rawText);

   typeText(
       dialogText,
       processedText
   );
}

function closeDialog() {

    const dialog =
        document.getElementById("novelDialog");

    dialog.classList.remove("open");

    clearTimeout(typingTimeout);

    isTyping = false;
}

/* ================= TYPE EFFECT ================= */

function typeText(element, text) {

    clearTimeout(typingTimeout);

    element.textContent = "";

    isTyping = true;

    let i = 0;

    function print() {

        if (i < text.length) {

            element.textContent += text[i];

            i++;

            typingTimeout =
                setTimeout(print, TYPE_SPEED);

        } else {

            isTyping = false;
        }
    }

    print();
}

/* ================= DIALOG LOGIC ================= */

function resolveDialog(
    character,
    friend
) {

    let dialogs = {};

    try {

        dialogs =
            JSON.parse(
                character.dialoges
            );

    } catch (e) {

        console.error(
            "Ошибка JSON dialoges",
            e
        );

        return "Привет!";
    }

    const friendshipLvl =
        friend.friendshipLvl || 1;

    const storageKey =
        `friend_dialog_${friend.id}`;

    const viewed =
        JSON.parse(
            localStorage.getItem(
                storageKey
            ) || "{}"
        );

    for (
        let level = 1;
        level <= friendshipLvl;
        level++
    ) {

        const key =
            `main${level}`;

        if (!dialogs[key]) {
            continue;
        }

        // если прошлые уровни
        // ещё не просмотрены —
        // показываем их

        if (!viewed[key]) {

            viewed[key] = true;

            localStorage.setItem(
                storageKey,
                JSON.stringify(viewed)
            );

            return dialogs[key];
        }
    }

    // всё уже просмотрено —
    // показываем последнюю
    // доступную реплику

    const fallbackKey =
        `main${friendshipLvl}`;

    return (
        dialogs[fallbackKey]
        || dialogs.main1
        || "Привет."
    );
}