import { auth } from "./firebaseInit.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  EmailAuthProvider,
  linkWithCredential,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

export async function signUp(email, password) {
  try {
    const userInfo = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userInfo.user;
  } catch (error) {
    alert("Sign up failed");
    return null;
  }
}

export async function login(email, password) {
  try {
    const userInfo = await signInWithEmailAndPassword(auth, email, password);
    return userInfo.user;
  } catch (error) {
    alert("Sign in failed");
    return null;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    alert("Logout failed");
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

// This is when user just starts game without sign up or login
export async function handleAnonymousLogin() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    alert("Anonymous login failed");
    return null;
  }
}

// CAN ONLY WORK FOR SIGN UP, users cannot transfer their
// progress to an existing account cuz this is just less work to do for
// now. Main MVP stuff will be there adn we do more when we have time
export async function linkAnonymousAccount(email, password) {
  if (!auth.currentUser || !auth.currentUser.isAnonymous) {
    alert("Error: No user to link");
    return null;
  }

  try {
    const credential = EmailAuthProvider.credential(email, password);
    const userCredential = await linkWithCredential(
      auth.currentUser,
      credential
    );
    return userCredential.user;
  } catch (error) {
    alert("Error saving account");
    return null;
  }
}
