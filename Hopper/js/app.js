import { auth } from "./firebaseInit.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import * as authService from "./authService.js";
import * as dataService from "./dataService.js";
import * as uiService from "./uiService.js";
import * as gameLogic from "./gameLogic.js";

let currentUser = null;
let currentUserName = "Traveler";

document.addEventListener("DOMContentLoaded", () => {
  attachUIListeners();

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      console.log("User signed in:", user.uid);
      await loadGameForUser(user.uid);
    } else {
      console.log("Guest/No User");
    }
  });
});

async function loadGameForUser(uid) {
  const userData = await dataService.loadUserData(uid);

  if (userData) {
    currentUserName = userData.username || "Traveler";
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf("/") + 1) || "index.html";

    // If on index but have a saved game page
    if (
      (pageName === "index.html" || pageName === "") &&
      userData.currentPage &&
      userData.currentPage !== "index.html"
    ) {
      window.location.href = userData.currentPage;
      return;
    }

    // sAve current page if different from saved.
    if (pageName !== "index.html" && pageName !== userData.currentPage) {
      await dataService.saveUserProgress(uid, { currentPage: pageName });
    }

    gameLogic.setState({
      hasPowerCrystal: userData.inventory.hasHarmonyCrystal,
      hasCloak: userData.inventory.hasCloak,
      hasBow: userData.inventory.hasBow,
      hasPicture: userData.inventory.hasPicture,
      numOfHops: userData.numOfHops || 2,
      hidingSpots: userData.hidingSpots || {},
      itemAssignments: userData.itemAssignments || {},
      startTime: userData.startTime,
      gameEnded: userData.gameEnded,
      inventory: [],
      dialogueHistory: userData.dialogueHistory || [],
    });

    const visualInventory = [];
    const inventoryPathState = [];

    // Load visual inventory
    if (userData.inventory.hasHarmonyCrystal) {
      const path = gameLogic.itemDefinitions.crystal.path;
      visualInventory.push(path);
      inventoryPathState.push(path);

      const hopperImg = document.getElementById("hopperDevice");
      if (hopperImg)
        hopperImg.src = "assets/images/presentAssets/Hopper_Device_Fixed.png";
    }
    if (userData.inventory.hasBow) {
      const path = gameLogic.itemDefinitions.bow.path;
      visualInventory.push(path);
      inventoryPathState.push(path);
    }
    if (userData.inventory.hasCloak) {
      const path = gameLogic.itemDefinitions.cloak.path;
      visualInventory.push(path);
      inventoryPathState.push(path);
    }
    if (userData.inventory.hasPicture) {
      const path = gameLogic.itemDefinitions.picture.path;
      visualInventory.push(path);
      inventoryPathState.push(path);
    }

    gameLogic.setState({ inventory: inventoryPathState });
    uiService.updateInventoryUI(visualInventory);

    if (userData.dialogueHistory && userData.dialogueHistory.length > 0) {
      uiService.renderDialogue(userData.dialogueHistory);
    }

    // Only run game interactions if we are on a game page
    if (
      document.querySelector(".playerField") ||
      document.querySelector(".playerFieldLeft") ||
      document.querySelector(".playerFieldRight")
    ) {
      if (!userData.introSeen) {
        handleDialogueUpdate(
          "Professor: Welcome to the lab my dear friend I have been waiting for you!"
        );
        await dataService.saveUserProgress(uid, { introSeen: true });
      }
      setupGameInteractions();
    }
  }
}

async function handleDialogueUpdate(text) {
  uiService.typeNewDialogueLine(text);

  const currentHistory = gameLogic.getState().dialogueHistory;
  const newHistory = [...currentHistory, text];
  gameLogic.setState({ dialogueHistory: newHistory });

  if (currentUser) {
    await dataService.saveUserProgress(currentUser.uid, {
      dialogueHistory: newHistory,
    });
  }
}

function setupGameInteractions() {
  const state = gameLogic.getState();

  const machine =
    document.getElementById("machine") ||
    document.getElementById("hopperMachine");
  if (machine) {
    const newMachine = machine.cloneNode(true);
    machine.parentNode.replaceChild(newMachine, machine);

    newMachine.addEventListener("click", () => {
      if (gameLogic.getState().gameEnded) return;

      const pageKey = gameLogic.getNodeForPage(window.location.pathname);
      const node = gameLogic.decisionPoints[pageKey];
      if (node) {
        // Don't re-type text if options are already open? No, machine click implies interaction.
        processNode(node);
      }
    });
  }

  // rand hiding spots
  const allSpots = [
    "crystalSpot",
    "bowSpot",
    "crateSpot",
    "stoneSpot",
    "floorSpot",
    "urnSpot",
    "boxSpot",
    "serverSpot",
  ];

  allSpots.forEach((spotId) => {
    const el = document.getElementById(spotId);
    if (el) {
      const assignedItemKey = state.itemAssignments[spotId];

      // If item assigned and collected, hide the spot
      if (
        assignedItemKey &&
        state.inventory.includes(
          gameLogic.itemDefinitions[assignedItemKey].path
        )
      ) {
        uiService.hideElement(`#${spotId}`);
        return;
      }

      if (state.hidingSpots[spotId]) {
        if (assignedItemKey) {
          // Show the item
          el.src = gameLogic.itemDefinitions[assignedItemKey].revealedImage;
          el.onclick = () => handleItemPickup(assignedItemKey, spotId);
        } else {
          // Show empty
          el.style.opacity = "0.5";
          el.onclick = () => handleDialogueUpdate("Just dust and echoes here.");
        }
      } else {
        // Click to reveal
        el.onclick = () => handleSpotReveal(spotId, assignedItemKey);
      }
    }
  });

  const gremlin = document.getElementById("gremlin");
  if (gremlin) {
    gremlin.onclick = () => {
      const hint = gameLogic.getGremlinHint(window.location.pathname);
      handleDialogueUpdate(hint);
    };
  }
}

async function handleSpotReveal(spotId, assignedItemKey) {
  const el = document.getElementById(spotId);
  handleDialogueUpdate("You investigate...");

  if (assignedItemKey) {
    // Found an item
    el.src = gameLogic.itemDefinitions[assignedItemKey].revealedImage;
    el.onclick = () => handleItemPickup(assignedItemKey, spotId);
    setTimeout(() => handleDialogueUpdate("You found something useful!"), 1000);
  } else {
    // Found nothing
    el.style.opacity = "0.5";
    setTimeout(() => handleDialogueUpdate("Nothing here but dust."), 1000);
    el.onclick = null;
  }

  const updateData = {};
  updateData[`hidingSpots.${spotId}`] = true;
  gameLogic.setState({
    hidingSpots: { ...gameLogic.getState().hidingSpots, [spotId]: true },
  });

  if (currentUser) {
    await dataService.saveUserProgress(currentUser.uid, updateData);
  }
}

async function handleItemPickup(itemId, elementId) {
  const itemDef = gameLogic.itemDefinitions[itemId];
  if (!itemDef) return;

  const state = gameLogic.getState();
  if (!state.inventory.includes(itemDef.path)) {
    const newInventory = [...state.inventory, itemDef.path];
    const newState = { inventory: newInventory };
    newState[itemDef.stateKey] = true;
    gameLogic.setState(newState);

    // Only hide element if it exists
    if (elementId) {
      uiService.hideElement(`#${elementId}`);
    }

    handleDialogueUpdate(itemDef.successMessage);
    uiService.updateInventoryUI(newInventory);

    if (itemId === "crystal") {
      const hopperImg = document.getElementById("hopperDevice");
      if (hopperImg)
        hopperImg.src = "assets/images/presentAssets/Hopper_Device_Fixed.png";
    }

    if (currentUser) {
      const updateData = {};
      updateData[itemDef.dbKey] = true;
      await dataService.saveUserProgress(currentUser.uid, updateData);
    }
  }
}

function handleOptionClick(option) {
  if (option.next === "restart") {
    if (currentUser) {
      dataService.resetUserGame(currentUser.uid).then(() => {
        window.location.href = "present.html";
      });
    } else {
      window.location.href = "index.html";
    }
    return;
  }

  if (option.next === "startPhotoTimer") {
    startPhotoTimer();
    return;
  }

  if (option.next.includes(".html")) {
    window.location.href = option.next;
    return;
  }

  const nextNode = gameLogic.decisionPoints[option.next];
  if (nextNode.condition) {
    const state = gameLogic.getState();
    const resultKey = nextNode.condition(state);
    const actualNode = gameLogic.decisionPoints[nextNode.results[resultKey]];
    processNode(actualNode);
  } else {
    processNode(nextNode);
  }
}

async function processNode(node) {
  handleDialogueUpdate(node.text);

  if (node.grantItem) {
    handleItemPickup(node.grantItem, null);
  }

  if (node.isEnding) {
    // if user logged in and game hasn't ended yet
    if (currentUser && !gameLogic.getState().gameEnded) {
      await dataService.saveUserProgress(currentUser.uid, { gameEnded: true });

      await dataService.submitScore(
        currentUser.uid,
        currentUserName,
        gameLogic.getState().startTime
      );

      handleDialogueUpdate("SCORE SUBMITTED! Check Leaderboard.");
      const scores = await dataService.getLeaderboard();
      uiService.showLeaderboard(scores);
    }

    // update local state immediately so the machine click is disabled
    gameLogic.setState({ gameEnded: true });
  }

  // Game over uses the same shared leaderboard popup via isEnding branch

  if (node.options) uiService.renderOptions(node.options, handleOptionClick);
}

function startPhotoTimer() {
  let remaining = 10;
  handleDialogueUpdate("Timer started: 10s");
  const intervalId = setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      handleDialogueUpdate(`Time left: ${remaining}s`);
    } else {
      clearInterval(intervalId);
      handleItemPickup("picture", null);
      handleDialogueUpdate("Photo captured. Escape to the Present.");
      uiService.renderOptions(
        [{ button: "Return to Present", text: "Run!", next: "present.html" }],
        handleOptionClick
      );
    }
  }, 1000);
}

function attachUIListeners() {
  const startBtn = document.getElementById("startButton");
  if (startBtn) startBtn.onclick = () => uiService.openPopup("popupLogin");

  const guestBtn = document.getElementById("guestLogin");
  if (guestBtn) guestBtn.onclick = handleAnonymousPlay;

  const guestSignupBtn = document.getElementById("guestSignup");
  if (guestSignupBtn) guestSignupBtn.onclick = handleAnonymousPlay;

  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await authService.logout();
      window.location.href = "index.html";
    };
  }

  const closeLeaderboard = document.getElementById("closeLeaderboard");
  if (closeLeaderboard) {
    closeLeaderboard.onclick = () => uiService.closePopup("leaderboardPopup");
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const user = await authService.login(email, password);
      if (user) {
        // Fetch latest user data to redirect to correct page
        const userData = await dataService.loadUserData(user.uid);
        window.location.href = userData?.currentPage || "present.html";
      }
    };
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const username = document.getElementById("signupUsername").value;
      const user = await authService.signUp(email, password);
      if (user) {
        await dataService.createUser(user.uid, username, email);
        window.location.href = "present.html";
      }
    };
  }

  const goToSignup = document.getElementById("goToSignup");
  if (goToSignup)
    goToSignup.onclick = () => {
      uiService.closePopup("popupLogin");
      uiService.openPopup("popupSignup");
    };

  const goToLogin = document.getElementById("goToLogin");
  if (goToLogin)
    goToLogin.onclick = () => {
      uiService.closePopup("popupSignup");
      uiService.openPopup("popupLogin");
    };
}

async function handleAnonymousPlay() {
  const user = await authService.handleAnonymousLogin();
  if (user) {
    await dataService.createUser(user.uid, "Traveler", "anonymous");
    window.location.href = "present.html";
  }
}
