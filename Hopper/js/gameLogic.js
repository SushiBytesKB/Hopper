let playerState = {
  hasPowerCrystal: false,
  hasCloak: false,
  hasBow: false,
  hasPicture: false,
  numOfHops: 0,
  dialogueHistory: [],
  inventory: [],
};

export function getState() {
  return playerState;
}

export function setState(newState) {
  playerState = { ...playerState, ...newState };
}

export const itemDefinitions = {
  crystal: {
    id: "crystal",
    path: "assets/images/pastAssets/Harmony_Crystal.png",
    successMessage:
      "Gremlin: Congratulations!! You picked up the Energy Crystal",
    stateKey: "hasPowerCrystal",
  },
  bow: {
    id: "bow",
    path: "assets/images/pastAssets/Ancient_Recurve_Bow.png",
    successMessage: "Gremlin: Congratulations!! You picked up the Ancient Bow",
    stateKey: "hasBow",
  },
};

export function getGremlinHint(currentPage) {
  let hintText = "";
  const { hasBow, hasPowerCrystal } = playerState;

  if (currentPage.includes("pastLeft")) {
    if (hasPowerCrystal) {
      hintText = "Gremlin: Let's try hopping again?";
    } else {
      hintText = "Gremlin: A strange device. It looks dormant.";
    }
  } else if (currentPage.includes("pastRight")) {
    hintText = "Gremlin: It's suspiciously empty in here... or is it?";
  } else {
    if (hasBow && hasPowerCrystal) {
      hintText =
        "Gremlin: You have the items! Now, what to do with them? Explore the other rooms.";
    } else if (hasPowerCrystal && !hasBow) {
      hintText =
        "Gremlin: That Crystal is pretty, but you are defenseless. Go check around for more.";
    } else if (hasBow && !hasPowerCrystal) {
      hintText =
        "Gremlin: Nice Bow! But it's useless without power. Search the other rooms for a power source.";
    } else {
      hintText =
        "Gremlin: I sense strong powerful energy within this room. Lets look around.";
    }
  }
  return hintText;
}

export const decisionPoints = {
  start: {
    text: "Welcome to the lab my dear friend I have been waiting for you\n",
    options: [
      {
        button: "to the Future",
        text: "You enter the Hopper machine and travel to the Future...\n",
        next: "checkFuture",
      },
      {
        button: "to the Past",
        text: "You enter the Hopper machine and traverse multiple Timelines to go to the past\n",
        next: "pastFromStart",
      },
    ],
  },

  pastFromStart: {
    text: "You look around and find yourself in an ancient Temple. The Hopper machine stands behind you, looking the same as before: a gaping dark hole in its center. You have to find the Harmony Crystal...\n\n",
    options: [
      {
        button: "to the Future",
        text: "You enter the Hopper machine once again and embark on another time-travel, this time the Future lies ahead\n",
        next: "checkFuture",
      },
      {
        button: "to the Present",
        text: "You step foot into the familiar Hopper machine and return to the present to reunite with the Professor...\n",
        next: "presentFromPast",
      },
    ],
  },

  presentFromPast: {
    text: "You have made it back to the Present and reunite with the professor. Are you going to talk to him or hop back to another timeline?\n\n",
    options: [
      {
        button: "talk to the Professor",
        text: "You turn towards the Professor and tap his shoulder before talking: \n",
        next: "checkPresent",
      },
      {
        button: "to the Future",
        text: "You step foot back into the Hopper machine instead of conversing with the professor. \n",
        next: "checkFuture",
      },
    ],
  },

  presentFromFuture: {
    text: "You have made it back to the Present and reunite with the professor. Are you going to talk to him or hop back to another timeline?\n\n",
    options: [
      {
        button: "talk to the Professor",
        text: "You turn towards the Professor and tap his shoulder before talking: \n",
        next: "checkPresent",
      },
      {
        button: "to the Past",
        text: "You step foot back into the Hopper machine instead of conversing with the professor.\n ",
        next: "pastFromPresent",
      },
    ],
  },

  pastFromPresent: {
    text: "You look around and find yourself in an ancient Temple.\n\n",
    options: [
      {
        button: "to the Future",
        text: "You enter the Hopper machine once again and embark on another time-travel, this time the Future lies ahead\n",
        next: "checkFuture",
      },
      {
        button: "to the Present",
        text: "You step foot into the familiar Hopper machine and return to the present to reunite with the Professor...\n",
        next: "presentFromPast",
      },
    ],
  },

  checkFuture: {
    condition: (state) => {
      if (!state.hasCloak) {
        return "terribleF";
      } else {
        return "futureCloak";
      }
    },
    results: {
      terribleF: "futureTerrible",
      futureCloak: "futureWithCloak",
    },
  },

  checkPresent: {
    condition: (playerState) => {
      if (!playerState.hasPowerCrystal) {
        return "terrible";
      }
      if (playerState.hasPowerCrystal) {
        if (playerState.hasBow && !playerState.hasPicture) {
          return "neutralBow";
        }

        if (!playerState.hasBow && playerState.hasPicture) {
          return "neutralPicture";
        }

        if (!playerState.hasBow && !playerState.hasPicture) {
          return "badNoBowNoPicture";
        }

        if (playerState.hasBow && playerState.hasPicture) {
          return "good";
        }
      }
    },
    results: {
      terrible: "presentNoCrystal",
      neutralBow: "neutralEndingHasBow",
      neutralPicture: "neutralEndingHasPicture",
      badNoBowNoPicture: "badEndingNoBowNoPicture",
      good: "goodEnding",
    },
  },

  futureWithCloak: {
    text: "You peek out beneath you Cloak of Invisibility and to your surprise, the Cyborgs actually look right through you as if you were not there. This buys you enough time to grab your trusty camera and snap a quick picture of the disaster.\n\n",
    options: [
      {
        button: "to the Present",
        text: "You leap back into the Hopper Machine and make a run for the safe Present before your Cloak of Invisibility runs out or malfuncitons; it should not happen but better safe than sorry you think\n",
        next: "presentFromFuture",
      },
    ],
  },

  presentNoCrystal: {
    text: "You successfully made a useless trip to the Past and have gained nothing but experience. The Harmony Crystal is still destroyed and lost ... the Hopper machine clanks one last time before falling apart.\n\n",
    options: [{ button: "Play again?", text: "Play again?", next: "start" }],
  },

  neutralEndingHasBow: {
    text: "Wait... this is... my bow? I though I would never see it ever again. My grandfather crafted it out of the Elderwood tree my ancestors planted. I saw it burn to a crisp in front of my eyes during an attack.\n\n",
    options: [{ button: "Play again?", text: "Play again?", next: "start" }],
  },

  neutralEndingHasPicture: {
    text: "Hold on let me see this ... what is going on here? Is this really what my research would do to this world? I guess I have to think it over and make some adjustments to prevent this\n\n",
    options: [{ button: "Play again?", text: "Play again?", next: "start" }],
  },

  badEndingNoBowNoPicture: {
    text: "Thank you so so much my dear friend! Finally, the last puzzle piece to my success in creating the strongest AI the world has ever seen. I thank you endlessly!\n\n",
    options: [{ button: "Play again?", text: "Play again?", next: "start" }],
  },

  goodEnding: {
    text: "This is ... WHAT? My bow!! ADD BOW YAP HERE. AND my invention will destroy the future of this planet?! What am I doing? What have I done? I thank you deeply my friend ... I guess ... NO ... I KNOW that I will stop and halt everything right this moment and return to a peaceful life and maybe take little Tro with me.\n\n",
    options: [{ button: "Play again?", text: "Play again?", next: "start" }],
  },

  futureTerrible: {
    text: "You moron went to the Future well knowing that you had only one Hop left. The Cyborg shot you the second you stepped foot into this timeline as you had neither escape nor defense\n\n",
    options: [{ button: "Play again?", text: "Play again?", next: "start" }],
  },

  sample: {
    text: "",
    options: [{ text: "", next: "" }, {}],
  },
};
