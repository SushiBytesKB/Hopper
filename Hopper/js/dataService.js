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

  const { itemAssignments } = generateRandomSpots();

  const newUserData = {
    uid: uid,
    username: username,
    email: email,
    createdAt: serverTimestamp(),
    startTime: Date.now(),
    gameEnded: false,
    introSeen: false,
    dialogueHistory: [],
    currentPage: "present.html", // Default start

    // Store the random locations
    itemAssignments: itemAssignments,

    inventory: {
      hasHarmonyCrystal: false,
      hasCloak: false,
      hasBow: false,
      hasPicture: false,
    },
    // Track if a spot has been searched/revealed
    hidingSpots: {
      crystalSpot: false,
      bowSpot: false,
      crateSpot: false,
      stoneSpot: false,
      urnSpot: false,
      floorSpot: false,
      boxSpot: false,
      serverSpot: false,
    },
  };

  try {
    await setDoc(userDocRef, newUserData);
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
}

// reset game
export async function resetUserGame(uid) {
  const userDocRef = doc(db, "users", uid);

  const { itemAssignments } = generateRandomSpots();

  const resetData = {
    startTime: Date.now(),
    gameEnded: false,
    introSeen: false, // Reset intro
    dialogueHistory: [],
    currentPage: "present.html",
    itemAssignments: itemAssignments,

    inventory: {
      hasHarmonyCrystal: false,
      hasCloak: false,
      hasBow: false,
      hasPicture: false,
    },

    hidingSpots: {
      crystalSpot: false,
      bowSpot: false,
      crateSpot: false,
      stoneSpot: false,
      urnSpot: false,
      floorSpot: false,
      boxSpot: false,
      serverSpot: false,
    },
  };

  try {
    await updateDoc(userDocRef, resetData);
  } catch (error) {
    console.error("Error resetting game:", error);
  }
}

// Helper for randomization
function generateRandomSpots() {
  const pastSpots = [
    "crystalSpot",
    "bowSpot",
    "crateSpot",
    "stoneSpot",
    "floorSpot",
    "urnSpot",
  ];
  const presentSpots = ["boxSpot", "serverSpot"];

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledPast = shuffle([...pastSpots]);
  const shuffledPresent = shuffle([...presentSpots]);

  return {
    itemAssignments: {
      [shuffledPast[0]]: "crystal",
      [shuffledPast[1]]: "bow",
      [shuffledPresent[0]]: "cloak",
    },
  };
}

export async function loadUserData(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error("Error loading user data", error);
    return null;
  }
}

export async function saveUserProgress(uid, progressData) {
  if (!uid) return;
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, progressData);
  } catch (error) {
    console.error("Error saving user progress:", error);
  }
}

export async function submitScore(uid, username, startTime) {
  try {
    const duration = (Date.now() - startTime) / 1000;
    const leaderboardCollection = collection(db, "leaderboard");
    await addDoc(leaderboardCollection, {
      uid: uid,
      username: username,
      duration: duration,
      submittedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to submit score", error);
  }
}

export async function getLeaderboard() {
  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("duration", "asc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => scores.push(doc.data()));
    return scores;
  } catch (error) {
    return [];
  }
}
