const INTRO_SHOWN_KEY = "gremlinIntroShown";

// Load saved game state
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let dialogue = JSON.parse(localStorage.getItem("dialogue")) || [];
let gremlinIntroShown = localStorage.getItem(INTRO_SHOWN_KEY) === "true";

function saveGame() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("dialogue", JSON.stringify(dialogue));
  localStorage.setItem(INTRO_SHOWN_KEY, gremlinIntroShown ? "true" : "false");
}

function renderDialogue() {
  const box = document.querySelector(".dialogueContent");
  if (!box) return;

  box.innerHTML = dialogue.map((line) => `<p>${line}</p>`).join("");
  box.scrollTop = box.scrollHeight;
}

// Typewriter effect for a new line
function typeNewDialogueLine(text, speed = 30) {
  const box = document.querySelector(".dialogueContent");
  if (!box) return;

  const p = document.createElement("p");
  box.appendChild(p);

  let i = 0;
  const typer = setInterval(() => {
    p.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(typer);
      // Save after typing
      dialogue.push(text);
      saveGame();
    }
    box.scrollTop = box.scrollHeight;
  }, speed);
}

function startGremlinIntro() {
  if (gremlinIntroShown) return;

  const welcomeMessage =
    "Gremlin: Hey traveler! Welcome to the Ancient Temple. I'm here to guide you. You need to gather the Harmony Crystal and the Ancient Bow hidden in these rooms. Look carefully, they will be key to your future.";

  typeNewDialogueLine(welcomeMessage, 25);
  gremlinIntroShown = true;
  saveGame();
}

// Inventory slots
function populateSlotsFromInventory() {
  inventory.forEach((itemSrc) => placeItemInNextSlot(itemSrc));
}

function placeItemInNextSlot(imageSrc) {
  for (let i = 1; i <= 5; i++) {
    const slot = document.getElementById(`slot${i}`);
    if (!slot.hasChildNodes()) {
      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = "Inventory item";
      slot.appendChild(img);
      return;
    }
  }
  console.warn("No available inventory slots!");
}

// Pick up items
function addToInventory(imageSrc, message, spotElement) {
  if (!inventory.includes(imageSrc)) {
    inventory.push(imageSrc);
    placeItemInNextSlot(imageSrc);
    saveGame();
    typeNewDialogueLine(message);

    if (spotElement) {
      spotElement.style.pointerEvents = "none";
      spotElement.style.opacity = "0";
    }
  }
}

// Setup item click handlers
function setupItems() {
  const crystal = document.getElementById("crystalSpot");
  const bow = document.getElementById("bowSpot");

  if (crystal) {
    const path = "assets/images/pastAssets/Harmony_Crystal.png";
    if (inventory.includes(path)) {
      crystal.style.pointerEvents = "none";
      crystal.style.opacity = "0";
    } else {
      crystal.addEventListener("click", () => {
        addToInventory(
          path,
          "Gremlin: Congratulations!! You picked up the Energy Crystal",
          crystal
        );
      });
    }
  }

  if (bow) {
    const path = "assets/images/pastAssets/Ancient_Recurve_Bow.png";
    if (inventory.includes(path)) {
      bow.style.pointerEvents = "none";
      bow.style.opacity = "0";
    } else {
      bow.addEventListener("click", () => {
        addToInventory(
          path,
          "Gremlin: Congratulations!! You picked up the Ancient Bow",
          bow
        );
      });
    }
  }
}

// Initialize everything
window.addEventListener("DOMContentLoaded", () => {
  populateSlotsFromInventory();
  renderDialogue();
  startGremlinIntro();
  setupItems();
});
