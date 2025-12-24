## Hopper

**An Interactive, Decision-Based Time-Travel Web Game**

Hopper is a fully web-based, narrative-driven game that explores non-linear storytelling through standard web technologies. Players traverse **Past, Present, and Future timelines**, making decisions that directly affect the story and determine one of three endings.

🎮 **Play instantly in the browser, no downloads required.**

---

## Live Demo

👉 **Play Hopper here:**
**[]**

> Best experienced in **Google Chrome**

---

## Game Overview

The story begins in a modern laboratory with a Professor and the unstable **Hopper Machine**, a device capable of traveling through time. A failed experiment has destroyed the machine’s stabilization unit, the **Energy Crystal**, threatening the fabric of reality.

With only a few remaining hops, players must:

* Travel between timelines
* Search for hidden artifacts
* Make critical decisions
* Restore balance… or cause collapse

---

## Core Features

### Branching Narrative

* Player decisions dynamically alter the story
* Multiple dialogue paths and **three unique endings**:

  * Balance Restored (Good)
  * Time Loop (Neutral)
  * Timeline Collapse (Bad)

### Timeline Traversal

* Travel between **Past, Present, and Future**
* Each timeline has its own visuals, characters, and mechanics

### Inventory & Exploration

* Hidden artifacts scattered across timelines
* Items persist across rooms and timelines
* Inventory impacts dialogue and endings

### Dynamic Replayability

* Artifact locations are randomized each playthrough
* Encourages exploration instead of memorization

### Distinct World Styling

* Each timeline features unique CSS themes and assets
* Visual storytelling reinforces the time-travel narrative

### Competitive Progression

* Firebase leaderboard tracks fastest completion times
* Optional login or guest play supported

### Save State

* Firebase saves player progress, inventory, and decisions
* Resume gameplay across sessions

---

## Architecture

**Frontend**

* HTML / CSS / JavaScript
* Separate files per timeline (Past, Present, Future)

**Backend / Cloud**

* Google Firebase

  * Authentication
  * Firestore database
  * Save states & leaderboard

**Core Logic**

* Decision Tree implemented in JavaScript
* Central game logic shared across timelines

---

## Technologies Used

* **HTML, CSS, JavaScript**
* **Google Firebase** (Auth + Firestore)
* **GitHub** (Version Control)
* **Google Gemini AI** (Asset Generation & assistance)
* **VS Code**

---

## Running Locally (Optional)

1. Clone the repository:

   ```bash
   git clone https://github.com/SushiBytesKB/Hopper.git
   ```
2. Open the project in **Visual Studio Code**
3. Install the **Live Server** extension
4. Right-click `index.html` → **Open with Live Server**
5. Hop away 🚀

---

## Future Improvements

* Expanded dialogue system with player responses
* More timelines and branching paths
* Animated and voiced NPCs
* Multiplayer timeline interactions

---

