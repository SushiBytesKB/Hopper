
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
        },
        results:
        {
            'terrible' : 'futureTerrible',


        }
    },

    'checkPast': 
    {
        condition: (playerState) =>
        {
            
        },
        results:
        {
            
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