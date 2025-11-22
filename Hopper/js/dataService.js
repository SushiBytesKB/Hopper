import { db } from "./firebaseInit.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
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

export async function loadUserData(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error loading user data");
    return null;
  }
}

export async function saveUserProgress(uid, progressData) {
  if (!uid) {
    console.warn("no user ID provided");
    return;
  }

  try {
    const userDocRef = doc(db, "users", uid);
    // Ok ok, this is goated: update doc merges data without overwriting the whole doc gg
    await updateDoc(userDocRef, progressData);
  } catch (error) {
    console.error("Error saving user progress:", error);
  }
}

// Score is for leaderboard btw [neutral, good, bad, and maybe more endings depending on what suspiciousBread says?]
// UPDATE, only one leaderboard lol
export async function submitScore(uid, username, endTime) {
  try {
    const leaderboardCollection = collection(db, "leaderboard");

    await addDoc(leaderboardCollection, {
      uid: uid,
      username: username,
      endTime: endTime,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    alert("Failed to submit score");
  }
}

// Get top 5 leaderboard
export async function getLeaderboard(endingType) {
  const scores = [];
  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("endTime", "asc"), // ascending duh
      limit(5)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      scores.push(doc.data());
    });

    return scores;
  } catch (error) {
    console.error("Error getting leaderboard");
    return [];
  }
}
