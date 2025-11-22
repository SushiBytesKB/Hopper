function addToInventory(imageSrc, altText, message) {
  // Use querySelector to grab the first element directly
  const textBox = document.querySelector(".dialogueHistory");
  const inventoryList = document.getElementById("inventoryList");

  // Create the item <li>
  const newItem = document.createElement("li");
  const itemImage = document.createElement("img");

  itemImage.src = imageSrc;
  itemImage.alt = altText;
  itemImage.style.width = "50px";
  itemImage.style.height = "50px";

  newItem.appendChild(itemImage);
  inventoryList.appendChild(newItem);

  // Update daialogue box
  textBox.textContent = message;
}

document.getElementById("crystalSpot").addEventListener("click", function () {
  addToInventory(
    "assets/images/energy_crystal.png",
    "Energy crystal",
    "You picked up the energy crystal!"
  );
  // Disable further clicks
  this.style.pointerEvents = "none";
});

document.getElementById("bowSpot").addEventListener("click", function () {
  addToInventory(
    "assets/images/ancient_bow.png",
    "Ancient bow",
    "You picked up the ancient bow!"
  );
  this.style.pointerEvents = "none";
});
