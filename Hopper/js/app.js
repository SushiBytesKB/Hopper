let playerState = {};

const dialogueHistoryElement = document.getElementById("dialogueHistory");
const optionsContainerElement = document.getElementById("optionsContainer");

var nextNode = 'start';


// stores the state of the player so we can neatly pass it to the function no matter how many states we will have

function restartGame()
{
    playerState =
    {
        hasPowerCrystal:  false,
        hasCloak: false,
        hasBow: false,
        hasPicture:  false,
        numOfHops: 0
    };

    nextNode = 'start';

    dialogueHistoryElement.innerHTML = '';
    optionsContainerElement.innerHTML = '';
}


const decisionPoints =
{
    'start': 
    {
        text: "Welcome to the lab my dear friend I have been waiting for you\n", // add full conversation
        options: 
        [
            {button: "to the Future", text: "You enter the Hopper machine and travel to the Future...\n", next: "checkFuture"},
            {button: "to the Past", text: "You enter the Hopper machine and traverse multiple Timelines to go to the past\n", next: "pastFromStart"}
        ]
    },

    'pastFromStart': 
    {
        text: "You look around and find yourself in an ancient Temple. The Hopper machine stands behind you, looking the same as before: a gaping dark hole in its center. You have to find the Harmony Crystal...\n\n",
        options: 
        [
            {button: "to the Future", text: "You enter the Hopper machine once again and embark on another time-travel, this time the Future lies ahead\n", next: "checkFuture"},
            {button: "to the Present", text: "You step foot into the familiar Hopper machine and return to the present to reunite with the Professor...\n", next: "presentFromPast"}
        ]
    },

    'presentFromPast': 
    {
        text: "You have made it back to the Present and reunite with the professor. Are you going to talk to him or hop back to another timeline?\n\n",
        options: 
        [
            {button: "talk to the Professor", text: "You turn towards the Professor and tap his shoulder before talking: \n", next: "checkPresent"},
            {button: "to the Future", text: "You step foot back into the Hopper machine instead of conversing with the professor. \n", next: "checkFuture"},
        ]
    },

    'presentFromFuture': 
    {
        text: "You have made it back to the Present and reunite with the professor. Are you going to talk to him or hop back to another timeline?\n\n",
        options: 
        [
            {button: "talk to the Professor", text: "You turn towards the Professor and tap his shoulder before talking: \n", next: "checkPresent"},
            {button: "to the Past", text: "You step foot back into the Hopper machine instead of conversing with the professor.\n ", next: "pastFromPresent"},
        ]
    },

     'pastFromPresent': 
    {
        text: "You look around and find yourself in an ancient Temple.\n\n",
        options: 
        [
            {button: "to the Future", text: "You enter the Hopper machine once again and embark on another time-travel, this time the Future lies ahead\n", next: "checkFuture"},
            {button: "to the Present", text: "You step foot into the familiar Hopper machine and return to the present to reunite with the Professor...\n", next: "presentFromPast"}
        ]
    },

    'checkFuture': 
    {
        condition: (playerState) =>
        {
            if (!playerState.hasCloak)
            {
                return 'terribleF'
            }
            else
            {
                return 'futureCloak'

            }
        },
        results:
        {
            'terribleF' : 'futureTerrible',
            'futureCloak' : 'futureWithCloak'
        }
    },

    'checkPresent': 
    {
        condition: (playerState) =>
        {
            if(!playerState.hasPowerCrystal)
            {
                return 'terrible';
            }
            if(playerState.hasPowerCrystal)
            {
                if(playerState.hasBow && !playerState.hasPicture)
                {
                    return 'neutralBow';
                }

                if(!playerState.hasBow && playerState.hasPicture)
                {
                    return 'neutralPicture';
                }

                if(!playerState.hasBow && !playerState.hasPicture)
                {
                    return 'badNoBowNoPicture';
                }

                if(playerState.hasBow && playerState.hasPicture)
                {
                    return 'good';
                }
            }
            
        },
        results:
        {
            'terrible' : 'presentNoCrystal',
            'neutralBow' : 'neutralEndingHasBow',
            'neutralPicture' : 'neutralEndingHasPicture',
            'badNoBowNoPicture' : "badEndingNoBowNoPicture",
            'good' : 'goodEnding'
            
        }
    },

    'futureWithCloak': 
    {
        text: "You peek out beneath you Cloak of Invisibility and to your surprise, the Cyborgs actually look right through you as if you were not there. This buys you enough time to grab your trusty camera and snap a quick picture of the disaster.\n\n",
        options: 
        [
            {button: "to the Present",text: "You leap back into the Hopper Machine and make a run for the safe Present before your Cloak of Invisibility runs out or malfuncitons; it should not happen but better safe than sorry you think\n", next: "presentFromFuture"}
        ]
    },


    'presentNoCrystal': 
    {
        text: "You successfully made a useless trip to the Past and have gained nothing but experience. The Harmony Crystal is still destroyed and lost ... the Hopper machine clanks one last time before falling apart.\n\n",
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"}
        ]
    },

    'neutralEndingHasBow': 
    {
        text: "Wait... this is... my bow? I though I would never see it ever again. My grandfather crafted it out of the Elderwood tree my ancestors planted. I saw it burn to a crisp in front of my eyes during an attack.\n\n", // add how he will change Ai a bit
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"}
        ]
    },

    'neutralEndingHasPicture': 
    {
        text: "Hold on let me see this ... what is going on here? Is this really what my research would do to this world? I guess I have to think it over and make some adjustments to prevent this\n\n", // add how he will change Ai a bit
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"}
        ]
    },

    'badEndingNoBowNoPicture': 
    {
        text: "Thank you so so much my dear friend! Finally, the last puzzle piece to my success in creating the strongest AI the world has ever seen. I thank you endlessly!\n\n", // maybe add more yap and lore here
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"}, // decide how to handle different endings like here the world will collapse due to the AI
        ]
    },

    'goodEnding': 
    {
        text: "This is ... WHAT? My bow!! ADD BOW YAP HERE. AND my invention will destroy the future of this planet?! What am I doing? What have I done? I thank you deeply my friend ... I guess ... NO ... I KNOW that I will stop and halt everything right this moment and return to a peaceful life and maybe take little Tro with me.\n\n", // add more yap
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"}
        ]
    },

    'futureTerrible': 
    {
        text: "You moron went to the Future well knowing that you had only one Hop left. The Cyborg shot you the second you stepped foot into this timeline as you had neither escape nor defense\n\n",
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"}
        ]
    },

    
    'sample': 
    {
        text: "",
        options: 
        [
            {text: "", next: ""},
            {}
        ]
    },

};








function showNodeText(nodeID)
{
    const node = decisionPoints[nodeID];

    if(node.condition) // if we reached a check node 
    {
        const result = node.condition(playerState);
        nextNode = node.results[result];
        showNodeText(nextNode);
        return;
    }

    const newDialogue = document.createElement('p');
    newDialogue.innerText = node.text;

    dialogueHistoryElement.appendChild(newDialogue);

    optionsContainerElement.innerHTML = '';
}

function showOptions(nodeID)
{
    const node = decisionPoints[nodeID];
    optionsContainerElement.innerHTML = '';

    for (const option of node.options)
        {
            const button = document.createElement('button');
            button.className = "btnDecisionOptions";
            button.innerText = option.button;

            button.addEventListener('click', () =>
            {
                if(option.next == "start")
                {
                    restartGame();
                }
                else
                {
                    
                    const travelDetails = document.createElement('p');
                    travelDetails.innerText = option.text;
                    dialogueHistoryElement.appendChild(travelDetails);

                    nextNode = option.next;

                    showNodeText(nextNode);

                    if(button.innerText == "to the Past")
                    {
                        window.location.href = 'past.html';
                    }
                    else if(button.innerText == "to the Future")
                    {
                        window.location.href = 'future.html';
                    }
                    else if(button.innerText == "to the Present")
                    {
                        window.location.href = 'present.html';
                    }
                }
            });
            button.style.height = '100px';
            button.style.width = '100px';

            optionsContainerElement.appendChild(button);
    }   
   
}

document.getElementById('machine').addEventListener('click', function()
{
    showOptions(nextNode);
});


document.getElementById('startButton').addEventListener('click', function()
{
    restartGame();
});












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


// LOGIN POPUP 

function openPopup()
{
  document.getElementById('popup').style.display = "flex";
}

function closePopup()
{
  document.getElementById('popup').style.display = 'none';
}


function closePopupSignup()
{
  document.getElementById('popupSignup').style.display = 'none';
}

function openSignup()
{
    closePopup();
    document.getElementById('popupSignup').style.display = "flex";
}

function closePopupSignupOpenLogin()
{
    closePopupSignup();
    openPopup();
}