import { auth } from "./firebaseInit.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import * as authService from "./authService.js";
import * as dataService from "./dataService.js";
import * as uiService from "./uiService.js";
import * as gameLogic from "./gameLogic.js";

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  attachUIListeners();

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      console.log("User is signed in");
      await loadGameForUser(user.uid);
    } else {
      console.log("User is signed out.");
      // Start anonymous play logic if not on index
      if (!window.location.pathname.endsWith("index.html")) {
        uiService.updateInventoryUI([]);
      }
    }
  });

  // Check if we are on a game page vs index page to run specific logic
  if (
    document.querySelector(".playerField") ||
    document.querySelector(".playerFieldLeft") ||
    document.querySelector(".playerFieldRight")
  ) {
    // Trigger the Gremlin Intro
    // TESTING FOR NOW (need to run the project first): we run it if history is empty.
    const state = gameLogic.getState();
    if (state.dialogueHistory.length === 0) {
      uiService.typeNewDialogueLine(
        "Gremlin: Hey traveler! Welcome to the Ancient Temple. I'm here to guide you. You need to gather the Harmony Crystal and the Ancient Bow hidden in these rooms. Look carefully, they will be key to your future."
      );
    }

    setupGameInteractions(); // Click listeners for items/machine
  }
});

async function loadGameForUser(uid) {
  const userData = await dataService.loadUserData(uid);

  if (userData) {
    gameLogic.setState({
      hasPowerCrystal: userData.inventory.hasHarmonyCrystal,
      hasCloak: userData.inventory.hasCloak,
      hasBow: userData.inventory.hasBow,
      hasPicture: userData.inventory.hasPicture,
      numOfHops: userData.numOfHops,
      inventory: [],
      dialogueHistory: userData.dialogueHistory || [],
    });

    const visualInventory = [];
    const inventoryState = [];

    if (userData.inventory.hasHarmonyCrystal) {
      visualInventory.push(gameLogic.itemDefinitions.crystal.path);
      inventoryState.push(gameLogic.itemDefinitions.crystal.path);
    }
    if (userData.inventory.hasBow) {
      visualInventory.push(gameLogic.itemDefinitions.bow.path);
      inventoryState.push(gameLogic.itemDefinitions.bow.path);
    }
    gameLogic.setState({ inventory: inventoryState });
    uiService.updateInventoryUI(visualInventory);

    if (userData.dialogueHistory && userData.dialogueHistory.length > 0) {
      uiService.renderDialogue(userData.dialogueHistory);
    }
  }
}

async function handleItemPickup(itemId, elementId) {
  const itemDef = gameLogic.itemDefinitions[itemId];
  if (!itemDef) return;

  const newState = {};
  newState[itemDef.stateKey] = true;

  const currentState = gameLogic.getState();
  if (!currentState.inventory.includes(itemDef.path)) {
    const newInventory = [...currentState.inventory, itemDef.path];
    newState.inventory = newInventory;

    gameLogic.setState(newState);

    uiService.hideElement(`#${elementId}`);
    uiService.typeNewDialogueLine(itemDef.successMessage);
    uiService.updateInventoryUI(newInventory);

    // Save to DB (if user is logged in)
    if (currentUser) {
      const updateData = {};
      if (itemId === "crystal")
        updateData["inventory.hasHarmonyCrystal"] = true;
      if (itemId === "bow") updateData["inventory.hasBow"] = true;

      // We need to push the new message to the history array
      // FOR NOW: let's just save the inventory flag
      await dataService.saveUserProgress(currentUser.uid, updateData);
    }
  }
}

function attachUIListeners() {
  // Index Page Buttons
  const startBtn = document.getElementById("startButton");
  if (startBtn) {
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      uiService.openPopup("popupSignup");
    });
  }

  // Popup (Signup)
  const closeSignupBtn = document.getElementById("closeSignup");
  if (closeSignupBtn) {
    closeSignupBtn.addEventListener("click", () => {
      uiService.closePopup("popupSignup");
      handleAnonymousPlay();
    });
  }

  const switchToLoginBtn = document.getElementById("switchToLogin");
  if (switchToLoginBtn) {
    switchToLoginBtn.addEventListener("click", () => {
      uiService.closePopup("popupSignup");
      uiService.openPopup("popupLogin");
    });
  }

  // Popup (Login)
  const closeLoginBtn = document.getElementById("closeLogin");
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener("click", () => {
      uiService.closePopup("popupLogin");
      handleAnonymousPlay();
    });
  }

  // Form Submissions
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const username = document.getElementById("signupUsername").value;

      const user = await authService.signUp(email, password);
      if (user) {
        await dataService.createUser(user.uid, username, email);
        window.location.href = "present.html";
      }
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const user = await authService.login(email, password);
      if (user) {
        window.location.href = "present.html";
      }
    });
  }
}

function setupGameInteractions() {
  // Items
  const crystalSpot = document.getElementById("crystalSpot");
  if (crystalSpot) {
    // Check if we already have it to hide it immediately
    const state = gameLogic.getState();
    if (state.hasPowerCrystal) {
      uiService.hideElement("#crystalSpot");
    } else {
      crystalSpot.addEventListener("click", () =>
        handleItemPickup("crystal", "crystalSpot")
      );
    }
  }

  const bowSpot = document.getElementById("bowSpot");
  if (bowSpot) {
    const state = gameLogic.getState();
    if (state.hasBow) {
      uiService.hideElement("#bowSpot");
    } else {
      bowSpot.addEventListener("click", () =>
        handleItemPickup("bow", "bowSpot")
      );
    }
  }

  // Decision System
  const machine = document.getElementById("machine");
  if (machine) {
    machine.addEventListener("click", () => {
      // Get current node. For now, hardcoded to 'start' or tracked via state
      const currentNode = gameLogic.decisionPoints["start"];

      uiService.renderOptions(currentNode.options, (selectedOption) => {
        uiService.typeNewDialogueLine(selectedOption.text);
        if (selectedOption.next.includes(".html")) {
          window.location.href = selectedOption.next;
        } else {
          // logic needed if next is not a page
        }
      });
    });
  }

  // Gremlin Hint Click??
}

async function handleAnonymousPlay() {
  const user = await authService.handleAnonymousLogin();
  if (user) {
    await dataService.createUser(user.uid, "Traveler", "anonymous");
    window.location.href = "present.html";
  }
}
