let playerState = {};

const dialogueHistoryElement = document.getElementById("dialogueHistory");
const optionsContainerElement = document.getElementById("optionsContainer");

function restartGame()
{
    playerState = 
    {
        hasPowerCrystal: false,
        hasCloak: false,
        hasBow: false,
        hasPicture:  false,
        numOfHops: 0
    }

    showNode("start");
}

function showNode(nodeID)
{
    const node = decisionPoints[nodeID];

    if(node.condition) // if we reached a check node 
    {
        const result =   node.condition(playerState);
        const nextNode = node.results[result];
        showNode(nextNode);
        return;
    }

    const newDialogue = document.createElement('p');
    newDialogue.innerText = node.text;

    dialogueHistoryElement.appendChild(newDialogue);

    optionsContainerElement.innerHTML = '';
}
