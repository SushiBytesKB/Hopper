let playerState = {
  hasPowerCrystal: false,
  hasCloak: false,
  hasBow: false,
  hasPicture: false,
  dialogueHistory: [],
  inventory: [],
  hidingSpots: {},
  startTime: null,
  gameEnded: false,
};

export function getState() {
  return playerState;
}

export function setState(newState) {
  playerState = { ...playerState, ...newState };
}

export function getNodeForPage(pathname) {
  if (pathname.includes("future")) return "futureHub";
  if (pathname.includes("past")) return "pastHub";
  if (pathname.includes("present")) return "presentHub";
  return "start";
}

export const itemDefinitions = {
  crystal: {
    id: "crystal",
    path: "assets/images/pastAssets/Harmony_Crystal.png",
    revealedImage: "assets/images/pastAssets/Harmony_Crystal.png",
    successMessage:
      "Gremlin: Congratulations!! You picked up the Energy Crystal",
    stateKey: "hasPowerCrystal",
    dbKey: "inventory.hasHarmonyCrystal",
  },
  bow: {
    id: "bow",
    path: "assets/images/pastAssets/Ancient_Recurve_Bow.png",
    revealedImage: "assets/images/pastAssets/Ancient_Recurve_Bow.png",
    successMessage: "Gremlin: Congratulations!! You picked up the Ancient Bow",
    stateKey: "hasBow",
    dbKey: "inventory.hasBow",
  },
  cloak: {
    id: "cloak",
    path: "assets/images/presentAssets/High-Tech_Stealth_Cloak.png",
    revealedImage: "assets/images/presentAssets/High-Tech_Stealth_Cloak.png",
    successMessage: "Professor: Woah! You acquired the Stealth Cloak!",
    stateKey: "hasCloak",
    dbKey: "inventory.hasCloak",
  },
  // Add pic of future later
  picture: {
    id: "picture",
    path: "assets/images/futureAssets/Photo_of_the_Destructive_Future.png",
    successMessage: "Destructive Robot: ALERT! Unusual activity detected!",
    stateKey: "hasPicture",
    dbKey: "inventory.hasPicture",
  },
};

export function getGremlinHint(currentPage) {
  const { hasBow, hasPowerCrystal } = playerState;

  if (currentPage.includes("pastLeft"))
    return hasPowerCrystal
      ? "Gremlin: Let's try hopping again?"
      : "Gremlin: A strange device. It looks dormant.";
  if (currentPage.includes("pastRight"))
    return "Gremlin: It's suspiciously empty in here... or is it?";

  if (hasBow && hasPowerCrystal)
    return "Gremlin: You have the items! Now, what to do with them? Explore the other rooms.";
  return "Gremlin: I sense strong powerful energy within this room. Lets look around.";
}

export const decisionPoints = {
  start: {
    text: "Welcome to the lab my dear friend I have been waiting for you!",
    options: [
      {
        button: "To Future",
        text: "You enter the Hopper machine and travel to the Future...",
        next: "future.html",
      },
      {
        button: "To Past",
        text: "You enter the Hopper machine and traverse multiple Timelines to go to the past",
        next: "past.html",
      },
    ],
  },
  presentHub: {
    text: "The space time continuum is stable. The machine seems to be its catalyst.",
    options: [
      {
        button: "To Future",
        text: "You enter the Hopper machine and travel to the Future...",
        next: "future.html",
      },
      {
        button: "To Past",
        text: "You enter the Hopper machine and traverse multiple Timelines to go to the past",
        next: "past.html",
      },
      // Condition
      {
        button: "Talk to Professor",
        text: "Analyzing Timeline...",
        next: "checkPresent",
      },
    ],
  },
  pastHub: {
    text: "Good luck travellar...",
    options: [
      {
        button: "Return to Present",
        text: "You step foot into the familiar Hopper machine and return to the present to reunite with the Professor...",
        next: "present.html",
      },
      {
        button: "To Future",
        text: "You enter the Hopper machine once again and embark on another time-travel, this time the Future lies ahead",
        next: "future.html",
      },
    ],
  },
  futureHub: {
    text: "You are in the Future. It is dangerous here.",
    options: [
      {
        button: "Return to Present",
        text: "You have made it back to the Present and reunite with the professor. Are you going to talk to him or hop back to another timeline?",
        next: "present.html",
      },
      {
        button: "Return to Past",
        text: "You step foot back into the Hopper machine instead of conversing with the professor.",
        next: "past.html",
      },

      { button: "Scout Area", text: "Looking around...", next: "checkFuture" },
    ],
  },

  // Logic nodes
  checkFuture: {
    condition: (state) => {
      if (!state.hasCloak && !state.hasPowerCrystal) return "noItems";
      if (!state.hasCloak && state.hasPowerCrystal) return "crystalOnly";
      if (state.hasCloak && state.hasPowerCrystal) return "cloakAndCrystal";
      return "cloakOnly";
    },
    results: {
      noItems: "futureGameOverNoItems",
      crystalOnly: "futureBadNoCloakHasCrystal",
      cloakAndCrystal: "futureCloakWithCrystal",
      cloakOnly: "futureTerrible",
    },
  },

  checkPresent: {
    condition: (state) => {
      if (!state.hasPowerCrystal) return "terrible";
      if (state.hasBow && state.hasPicture) return "good";
      if (state.hasBow) return "neutralBow";
      if (state.hasPicture) return "neutralPicture";
      return "badNoBowNoPicture";
    },
    results: {
      terrible: "presentNoCrystal",
      neutralBow: "neutralEndingHasBow",
      neutralPicture: "neutralEndingHasPicture",
      badNoBowNoPicture: "badEndingNoBowNoPicture",
      good: "goodEnding",
    },
  },

  futureCloakWithCrystal: {
    text: "Your stealth cloak dampens your signature. The crystal stabilizes your temporal footprint. You have a brief window to capture evidence.",
    options: [
      { button: "Start photo capture", text: "Initiating...", next: "startPhotoTimer" },
    ],
  },

  futureGameOverNoItems: {
    isGameOver: true,
    isEnding: true,
    text: "GAME OVER: You entered the Future with no cloak and no crystal. The robots detect you instantly.",
    options: [
      { button: "Play Again", text: "Playing again...", next: "restart" },
    ],
  },

  futureBadNoCloakHasCrystal: {
    isGameOver: true,
    isEnding: true,
    text: "BAD ENDING: You carry the crystal, but without a cloak you are spotted and eliminated.",
    options: [
      { button: "Play Again", text: "Playing again...", next: "restart" },
    ],
  },

  presentNoCrystal: {
    isEnding: true,
    text: "BAD ENDING: The machine fails without the crystal. You are stuck. You successfully made a useless trip to the Past and have gained nothing but experience. The Harmony Crystal is still destroyed and lost ... the Hopper machine clanks one last time before falling apart.",
    options: [
      { button: "Play Again", text: "Playing again...", next: "restart" },
    ],
  },

  neutralEndingHasBow: {
    isEnding: true,
    text: "NEUTRAL ENDING: Wait... this is... my bow? I though I would never see it ever again. My grandfather crafted it out of the Elderwood tree my ancestors planted. I saw it burn to a crisp in front of my eyes during an attack. You have the bow, but the future is still bleak.",
    options: [
      { button: "Play Again", text: "Playing again...", next: "restart" },
    ],
  },

  neutralEndingHasPicture: {
    isEnding: true,
    text: "NEUTRAL ENDING: Hold on let me see this ... what is going on here? Is this really what my research would do to this world? I guess I have to think it over and make some adjustments to prevent this. You have the photo. You can warn the world, but you lack defense.",
    options: [
      { button: "Play Again", text: "Playing again...", next: "restart" },
    ],
  },

  badEndingNoBowNoPicture: {
    isEnding: true,
    text: "BAD ENDING: Thank you so so much my dear friend! Finally, the last puzzle piece to my success in creating the strongest AI the world has ever seen. I thank you endlessly! You fixed the machine but have no artifacts. The timeline remains broken.",
    options: [
      { button: "Play Again", text: "Playing again...", next: "restart" },
    ],
  },

  goodEnding: {
    isEnding: true,
    text: "GOOD ENDING: This is ... WHAT? My bow!! AND my invention will destroy the future of this planet?! What am I doing? What have I done? I thank you deeply my friend ... I guess ... NO ... I KNOW that I will stop and halt everything right this moment and return to a peaceful life and maybe take little Tro with me. With the Crystal, Bow, and Photo, you save the timeline!",
    options: [
      { button: "Play Again", text: "Playing again...", next: "restart" },
    ],
  },

  futureTerrible: {
    isGameOver: true,
    isEnding: true,
    text: "GAME OVER: You went to the Future without protection. The robots detect you immediately.",
    options: [
      { button: "Play Again", text: "Playing again...", next: "restart" },
    ],
  },

  sample: {
    text: "",
    options: [{ text: "", next: "" }, {}],
  },
};
