import { db } from "./firebaseInit.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export async function createUser(uid, username, email) {
  const userDocRef = doc(db, "users", uid);

  const newUserData = {
    uid: uid,
    username: username,
    email: email,
    createdAt: serverTimestamp(),
    currentTimer: 0,
    currentPage: "present.html",
    numOfHops: 2,
    machineFixed: false,
    dialogueHistory: [],
    inventory: {
      hasHarmonyCrystal: false,
      hasCloak: false,
      hasBow: false,
      hasPicture: false,
    },
    itemCoords: {
      powerCrystal: null,
      cloak: null,
      bow: null,
    },
    hidingSpots: {
      presentRightServerRevealed: false,
      presentLeftBoxRevealed: false,
      pastCenterPotRevealed: false,
      pastCenterStoneRevealed: false,
      pastRightCrateRevealed: false,
      pastRightStoneRevealed: false,
      pastLeftFloorRevealed: false,
      pastLeftUrnRevealed: false,
    },
    nextNode: "start",
  };

  try {
    await setDoc(userDocRef, newUserData);
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
}
