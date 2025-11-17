
// stores the state of the player so we can neatly pass it to the function no matter how many states we will have

const playerState =
{
    hasPowerCrystal:  true,
    hasCloak: false,
    hasBow: false,
    hasPicture:  false,
    numOfHops: 0
};



const decisionPoints =
{
    'start': 
    {
        text: "Welcome to the lab my dear friend I have been waiting for you", // add full conversation
        options: 
        [
            {text: "You enter the Hopper machine and travel to the Future...", next: "checkFuture"},
            {text: "You enter the Hopper machine and traverse multiple Timelines to go to the past", next: "pastFromStart"}
        ]
    },

    'pastFromStart': 
    {
        text: "You look around and find yourself in an ancient Temple. The Hopper machine stands behind you, looking the same as before: a gaping dark hole in its center. You have to find the Harmony Crystal...",
        options: 
        [
            {text: "You enter the Hopper machine once again and embark on another time-travel, this time the Future lies ahead", next: "checkFuture"},
            {text: "You step foot into the familiar Hopper machine and return to the present to reunite with the Professor...", next: "checkPresent"}
        ]
    },


    'checkFuture': 
    {
        condition: (playerState) =>
        {
            if (!playerState.hasPowerCrystal && !playerState.hasCloak && playerState.numOfHops == 0)
            {
                return 'terrible'
            }
            if (playerState.hasCloak)
            {
                return 'futureCloak';
            }
        },
        results:
        {
            'terrible' : 'futureTerrible',
            'futureCloak' : 'futureWithCloak'
        }
    },

    'checkPresent': 
    {
        condition: (playerState) =>
        {
            if(!playerState.hasPowerCrystal)
            {
                return 'terrible';
            }
            if(playerState.hasPowerCrystal)
            {
                if(playerState.hasBow && !playerState.hasPicture)
                {
                    return 'neutralBow';
                }

                if(!playerState.hasBow && playerState.hasPicture)
                {
                    return 'neutralPicture';
                }

                if(!playerState.hasBow && !playerState.hasPicture)
                {
                    return 'badNoBowNoPicture';
                }

                if(playerState.hasBow && playerState.hasPicture)
                {
                    return 'good';
                }
            }
            
        },
        results:
        {
            'terrible' : 'presentNoCrystal',
            'neutralBow' : 'neutralEndingHasBow',
            'neutralPicture' : 'neutralEndingHasPicture',
            'badNoBowNoPicture' : "badEndingNoBowNoPicture",
            'good' : 'goodEnding'
            
        }
    },

    'futureWithCloak': 
    {
        text: "You peek out beneath you Cloak of Invisibility and to your surprise, the Cyborgs actually look right through you as if you were not there. This buys you enough time to grab your trusty camera and snap a quick picture of the disaster.",
        options: 
        [
            {text: "You leap back into the Hopper Machine and make a run for the safe Present before your Cloak of Invisibility runs out or malfuncitons; it should not happen but better safe than sorry you think", next: "checkPresent"},
            {}
        ]
    },


    'presentNoCrystal': 
    {
        text: "You successfully made a useless trip to the Past and have gained nothing but experience. The Harmony Crystal is still destroyed and lost ... the Hopper machine clanks one last time before falling apart.",
        options: 
        [
            {text: "Play again?", next: "start"},
            {}
        ]
    },

    'neutralEndingHasBow': 
    {
        text: "Wait... this is... my bow? I though I would never see it ever again. My grandfather crafted it out of the Elderwood tree my ancestors planted. I saw it burn to a crisp in front of my eyes during an attack.", // add how he will change Ai a bit
        options: 
        [
            {text: "Play again?", next: "start"},
            {}
        ]
    },

    'neutralEndingHasPicture': 
    {
        text: "Hold on let me see this ... what is going on here? Is this really what my research would do to this world? I guess I have to think it over and make some adjustments to prevent this", // add how he will change Ai a bit
        options: 
        [
            {text: "Play again?", next: "start"},
            {}
        ]
    },

    'badEndingNoBowNoPicture': 
    {
        text: "Thank you so so much my dear friend! Finally, the last puzzle piece to my success in creating the strongest AI the world has ever seen. I thank you endlessly!", // maybe add more yap and lore here
        options: 
        [
            {text: "Play again?", next: "start"}, // decide how to handle different endings like here the world will collapse due to the AI
            {}
        ]
    },

    'goodEnding': 
    {
        text: "This is ... WHAT? My bow!! ADD BOW YAP HERE. AND my invention will destroy the future of this planet?! What am I doing? What have I done? I thank you deeply my friend ... I guess ... NO ... I KNOW that I will stop and halt everything right this moment and return to a peaceful life and maybe take little Tro with me.", // add more yap
        options: 
        [
            {text: "Play again?", next: "start"},
            {}
        ]
    },

    'futureTerrible': 
    {
        text: "You moron went to the Future well knowing that you had only one Hop left. The Cyborg shot you the second you stepped foot into this timeline as you had neither escape nor defense",
        options: 
        [
            {text: "Play again?", next: "start"},
            {}
        ]
    },

    
    'sample': 
    {
        text: "",
        options: 
        [
            {text: "", next: ""},
            {}
        ]
    },

};








let playerState = {};

const dialogueHistoryElement = document.getElementById("dialogueHistory");
const optionsContainerElement = document.getElementById("optionsContainer");

var nextNode = 'start';


// stores the state of the player so we can neatly pass it to the function no matter how many states we will have

playerState =
{
    hasPowerCrystal:  false,
    hasCloak: false,
    hasBow: false,
    hasPicture:  false,
    numOfHops: 0
};



const decisionPoints =
{
    'start': 
    {
        text: "Welcome to the lab my dear friend I have been waiting for you\n", // add full conversation
        options: 
        [
            {button: "to the Future", text: "You enter the Hopper machine and travel to the Future...", next: "checkFuture"},
            {button: "to the Past", text: "You enter the Hopper machine and traverse multiple Timelines to go to the past", next: "pastFromStart"}
        ]
    },

    'pastFromStart': 
    {
        text: "You look around and find yourself in an ancient Temple. The Hopper machine stands behind you, looking the same as before: a gaping dark hole in its center. You have to find the Harmony Crystal...\n",
        options: 
        [
            {button: "to the Future", text: "You enter the Hopper machine once again and embark on another time-travel, this time the Future lies ahead", next: "checkFuture"},
            {button: "to the Present", text: "You step foot into the familiar Hopper machine and return to the present to reunite with the Professor...", next: "checkPresent"}
        ]
    },


    'checkFuture': 
    {
        condition: (playerState) =>
        {
            if (!playerState.hasPowerCrystal && !playerState.hasCloak && playerState.numOfHops == 0)
            {
                return 'terribleF'
            }
            if (playerState.hasCloak)
            {
                return 'futureCloak';
            }
        },
        results:
        {
            'terribleF' : 'futureTerrible',
            'futureCloak' : 'futureWithCloak'
        }
    },

    'checkPresent': 
    {
        condition: (playerState) =>
        {
            if(!playerState.hasPowerCrystal)
            {
                return 'terrible';
            }
            if(playerState.hasPowerCrystal)
            {
                if(playerState.hasBow && !playerState.hasPicture)
                {
                    return 'neutralBow';
                }

                if(!playerState.hasBow && playerState.hasPicture)
                {
                    return 'neutralPicture';
                }

                if(!playerState.hasBow && !playerState.hasPicture)
                {
                    return 'badNoBowNoPicture';
                }

                if(playerState.hasBow && playerState.hasPicture)
                {
                    return 'good';
                }
            }
            
        },
        results:
        {
            'terrible' : 'presentNoCrystal',
            'neutralBow' : 'neutralEndingHasBow',
            'neutralPicture' : 'neutralEndingHasPicture',
            'badNoBowNoPicture' : "badEndingNoBowNoPicture",
            'good' : 'goodEnding'
            
        }
    },

    'futureWithCloak': 
    {
        text: "You peek out beneath you Cloak of Invisibility and to your surprise, the Cyborgs actually look right through you as if you were not there. This buys you enough time to grab your trusty camera and snap a quick picture of the disaster.\n",
        options: 
        [
            {button: "to the Present",text: "You leap back into the Hopper Machine and make a run for the safe Present before your Cloak of Invisibility runs out or malfuncitons; it should not happen but better safe than sorry you think", next: "checkPresent"},
            {}
        ]
    },


    'presentNoCrystal': 
    {
        text: "You successfully made a useless trip to the Past and have gained nothing but experience. The Harmony Crystal is still destroyed and lost ... the Hopper machine clanks one last time before falling apart.\n",
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"},
            {}
        ]
    },

    'neutralEndingHasBow': 
    {
        text: "Wait... this is... my bow? I though I would never see it ever again. My grandfather crafted it out of the Elderwood tree my ancestors planted. I saw it burn to a crisp in front of my eyes during an attack.\n", // add how he will change Ai a bit
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"},
            {}
        ]
    },

    'neutralEndingHasPicture': 
    {
        text: "Hold on let me see this ... what is going on here? Is this really what my research would do to this world? I guess I have to think it over and make some adjustments to prevent this\n", // add how he will change Ai a bit
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"},
            {}
        ]
    },

    'badEndingNoBowNoPicture': 
    {
        text: "Thank you so so much my dear friend! Finally, the last puzzle piece to my success in creating the strongest AI the world has ever seen. I thank you endlessly!\n", // maybe add more yap and lore here
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"}, // decide how to handle different endings like here the world will collapse due to the AI
            {}
        ]
    },

    'goodEnding': 
    {
        text: "This is ... WHAT? My bow!! ADD BOW YAP HERE. AND my invention will destroy the future of this planet?! What am I doing? What have I done? I thank you deeply my friend ... I guess ... NO ... I KNOW that I will stop and halt everything right this moment and return to a peaceful life and maybe take little Tro with me.\n", // add more yap
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"},
            {}
        ]
    },

    'futureTerrible': 
    {
        text: "You moron went to the Future well knowing that you had only one Hop left. The Cyborg shot you the second you stepped foot into this timeline as you had neither escape nor defense\n",
        options: 
        [
            {button: "Play again?", text: "Play again?", next: "start"},
            {}
        ]
    },

    
    'sample': 
    {
        text: "",
        options: 
        [
            {text: "", next: ""},
            {}
        ]
    },

};











function showNode(nodeID)
{
    const node = decisionPoints[nodeID];

    if(node.condition) // if we reached a check node 
    {
        const result = node.condition(playerState);
        nextNode = node.results[result];
        showNode(nextNode);
        return;
    }

    const newDialogue = document.createElement('p');
    newDialogue.innerText = node.text;

    dialogueHistoryElement.appendChild(newDialogue);

    optionsContainerElement.innerHTML = '';

    for (const option of node.options)
    {
        const button = document.createElement('button');
        button.innerText = option.button;

        button.addEventListener('click', () =>
        {
            if(option.next == "start")
            {
                restartGame();
            }
            else
            {
                nextNode = option.next;
            }
        });
        button.style.height = '100px';
        button.style.width = '100px';

        optionsContainerElement.appendChild(button);
    }
}

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

    dialogueHistoryElement.innerHTML = "";
    nextNode = 'start';

    showNode(nextNode);
}



document.getElementById('test').addEventListener('click', function()
{
    showNode(nextNode);
});