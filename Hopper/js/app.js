const typeSound = new Audio("assets/audios/click.mp3");
typeSound.volume = 0.4; 


const INTRO_SHOWN_KEY = "gremlinIntroShown";

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

function typeNewDialogueLine(text, speed = 30) {
  const box = document.querySelector(".dialogueContent");
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

// Logic for picking up items
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

// Asset click handlers
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

 function gremlinHint() {
   const currentPage = window.location.pathname;
   let hintText = "";

   const bowPath = "assets/images/pastAssets/Ancient_Recurve_Bow.png";
   const crystalPath = "assets/images/pastAssets/Harmony_Crystal.png";

   const hasBow = inventory.includes(bowPath);
   const hasCrystal = inventory.includes(crystalPath);


   if (currentPage.includes("pastLeft.html")) {
     if (hasCrystal) {
       hintText =
         "Gremlin: Let's try hopping again?";
     } else {
       hintText = "Gremlin: A strange device. It looks dormant.";
     }
   } else if (currentPage.includes("pastRight.html")) {
     hintText = "Gremlin: It's suspiciously empty in here... or is it?";
   } else {
  
     if (hasBow && hasCrystal) {
       hintText =
         "Gremlin: You have the items! Now, what to do with them? Explore the other rooms.";
     } else if (hasCrystal && !hasBow) {
       hintText =
         "Gremlin: That Crystal is pretty, but you are defenseless. Go check around for more.";
     } else if (hasBow && !hasCrystal) {
       hintText =
         "Gremlin: Nice Bow! But it's useless without power. Search the other rooms for a power source.";
     } else {
       hintText =
         "Gremlin: I sense strong powerful energy within this room. Lets look around.";
     }
   }

   const lastMessage = dialogue[dialogue.length - 1];
   const secondLastMessage = dialogue[dialogue.length - 2]; 
   const annoyMessage = "Gremlin: Stop poking me!";

   if (lastMessage === hintText) {
     // If you just heard the hint and you click again -> It gets annoyed
     typeNewDialogueLine(annoyMessage);
   } else if (lastMessage === annoyMessage) {
     // If its already annoyed, we check if hintText has changed.
     // If the new hint is different from the one that made him annoyed (hes secondLastMessage), he'll speak
     if (secondLastMessage !== hintText) {
       typeNewDialogueLine(hintText);
     }
     // If secondLastMessage is the same as hintText he ignores you.
   } else {
     // Normal case: He just says the hint
     typeNewDialogueLine(hintText);
   }
 }

function setupDecoys() {
  const currentPage = window.location.pathname;

  // Right room decoys (Crate & Stone)
  if (currentPage.includes("pastRight.html")) {
    const crate = document.getElementById("crateSpot");
    const stone = document.getElementById("stoneSpot"); 

    if (crate) {
      crate.addEventListener("click", () => {
        typeNewDialogueLine(
          "Gremlin: HaHaHa, there is nothing here!"
        );
      });
    }

    if (stone) {
      stone.addEventListener("click", () => {
        typeNewDialogueLine(
          "Gremlin: You can do better!! keep looking."
        );
      });
    }
  }

  // Left room decoys (Floor & Urn) 
  else if (currentPage.includes("pastLeft.html")) {
    const floor = document.getElementById("floorSpot");
    const urn = document.getElementById("urnSpot");

    if (floor) {
      floor.addEventListener("click", () => {
        typeNewDialogueLine(
          "Gremlin: Why are you staring at the floor? Look up!"
        );
      });
    }

    if (urn) {
      urn.addEventListener("click", () => {
        typeNewDialogueLine(
          "Gremlin: Someone looted this urn centuries ago!!"
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
  setupDecoys();
  setupItems();
});



 