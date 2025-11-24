const typeSound = new Audio("assets/audios/click.mp3");
typeSound.volume = 0.4;

export function clearDialogue() {
  const box = document.querySelector(".dialogueContent");
  if (box) box.innerHTML = "";
}

export function renderDialogue(dialogueArray) {
  const box = document.querySelector(".dialogueContent");
  if (!box) return;

  box.innerHTML = dialogueArray.map((line) => `<p>${line}</p>`).join("");
  box.scrollTop = box.scrollHeight;
}

export function typeNewDialogueLine(text, onComplete) {
  const box = document.querySelector(".dialogueContent");
  if (!box) return;

  const p = document.createElement("p");
  box.appendChild(p);

  let i = 0;
  typeSound.currentTime = 0;

  // testing: increase speed (15ms)
  // update: looks good, finalized
  const typer = setInterval(() => {
    p.textContent += text[i];

    // Play sound every few chars else it sounds funny and ridiculous lol
    if (i % 2 === 0) {
      const playPromise = typeSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }

    i++;
    box.scrollTop = box.scrollHeight; // auto-scroll

    if (i >= text.length) {
      clearInterval(typer);
      typeSound.pause();
      if (onComplete) onComplete();
    }
  }, 15);
}

export function updateInventoryUI(inventoryItems) {
  // Clear slots first
  for (let i = 1; i <= 5; i++) {
    const slot = document.getElementById(`slot${i}`);
    if (slot) slot.innerHTML = "";
  }

  // Populate slots
  inventoryItems.forEach((itemSrc) => {
    placeItemInNextSlot(itemSrc);
  });
}

function placeItemInNextSlot(imageSrc) {
  for (let i = 1; i <= 5; i++) {
    const slot = document.getElementById(`slot${i}`);
    if (slot && !slot.hasChildNodes()) {
      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = "Item";
      slot.appendChild(img);
      return;
    }
  }
}

export function renderOptions(options, onOptionClick) {
  const container = document.getElementById("optionsContainer");
  if (!container) return;

  container.innerHTML = "";
  container.style.display = "flex";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btnDecisionOptions";
    button.innerText = option.button;
    button.addEventListener("click", () => {
      container.innerHTML = "";
      onOptionClick(option);
    });

    container.appendChild(button);
  });
}

export function openPopup(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "flex";
}

export function closePopup(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

export function hideElement(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.style.pointerEvents = "none";
    el.style.opacity = "0";
  }
}

// Leaderboard Popup
export function showLeaderboard(scores) {
  const popup = document.getElementById("leaderboardPopup");
  const list = document.getElementById("leaderboardList");

  if (!popup || !list) return;

  let html = "";
  if (scores.length === 0) {
    html = "<p>No scores yet.</p>";
  } else {
    scores.forEach((s, index) => {
      html += `
                <div class="leaderboardEntry">
                    <span>#${index + 1} ${s.username}</span>
                    <span>${s.duration.toFixed(2)}s</span>
                </div>
            `;
    });
  }

  list.innerHTML = html;
  popup.style.display = "flex";
}

// Game Over Popup
// intentionally using the shared leaderboard-only flow for endings
