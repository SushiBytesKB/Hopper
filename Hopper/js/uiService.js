const typeSound = new Audio("../assets/audios/click.mp3");
typeSound.volume = 0.4;

export function clearDialogue() {
  const box = document.querySelector(".dialogueHistory"); // updated selector
  if (box) box.innerHTML = "";
}

export function renderDialogue(dialogueArray) {
  const box = document.querySelector(".dialogueHistory");
  if (!box) return;

  box.innerHTML = dialogueArray.map((line) => `<p>${line}</p>`).join("");
  box.scrollTop = box.scrollHeight;
}

export function typeNewDialogueLine(text, onComplete) {
  const box = document.querySelector(".dialogueHistory");
  if (!box) return;

  const p = document.createElement("p");
  box.appendChild(p);

  let i = 0;

  // Reset sound initially
  typeSound.pause();
  typeSound.currentTime = 0;

  const typer = setInterval(() => {
    p.textContent += text[i];

    // Reset position
    typeSound.currentTime = 0;

    // prevents console errors if typing is too fast
    const playPromise = typeSound.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Auto play is prevented
      });
    }

    i++;
    if (i >= text.length) {
      clearInterval(typer);

      // We pause it to prevent last play() command from going again and again
      typeSound.pause();
      typeSound.currentTime = 0;

      if (onComplete) onComplete();
    }
    box.scrollTop = box.scrollHeight;
  }, 30); // Default speed
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
      img.alt = "Inventory item";
      slot.appendChild(img);
      return;
    }
  }
}

export function renderOptions(options, onOptionClick) {
  const container = document.getElementById("optionsContainer"); // mke sure to check this exists in HTML
  if (!container) return;

  container.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btnDecisionOptions";
    button.innerText = option.button;
    button.style.height = "100px";
    button.style.width = "100px";

    button.addEventListener("click", () => {
      onOptionClick(option);
    });

    container.appendChild(button);
  });
}

export function openPopup(id) {
  document.getElementById(id).style.display = "flex";
}

export function closePopup(id) {
  document.getElementById(id).style.display = "none";
}

export function hideElement(selector) {
  document.querySelector(selector).style.pointerEvents = "none";
  document.querySelector(selector).style.opacity = "0";
}
