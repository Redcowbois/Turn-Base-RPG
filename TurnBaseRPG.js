var prompt = require("prompt"); // starts the prompt package (makes user input easier)

function randomNumber(min, max) {
  // this function makes it easier to create a range of numbers
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* 
Defining all the characters 

*It is setup so that for all characters, atk + def = 100
*/

// character1, all names are place holders, fire type
const CHAR1 = {
  name: "FireChar",
  id: 1,
  atk: 100 - Math.floor(randomNumber(40, 60)),
  def() {
    return 100 - this.atk;
  },
  speed: 50,
  typeName: "fire",
  typeId: 1,
  abilities: [
    {
      name: "Flamethrower",
      speed: 1.04,
      atk: 20,
    },
    {
      name: "Fire Shield",
      speed: 1.5,
      def: 25,
    },
  ],
};

// character2, all names are place holders, water type
const CHAR2 = {
  name: "WaterChar",
  id: 2,
  atk: 100 - Math.floor(randomNumber(30, 45)),
  def() {
    return 100 - this.atk;
  },
  speed: 60,
  typeName: "Water",
  typeId: 2,
  abilities: [
    {
      name: "Water Gun",
      speed: 1.07,
      atk: 15,
    },
    {
      name: "Water Shield",
      speed: 1.55,
      def: 35,
    },
  ],
};

// character3, all names are place holders, nature type
const CHAR3 = {
  name: "NatureChar",
  id: 3,
  atk: 100 - Math.floor(randomNumber(45, 55)),
  def() {
    return 100 - this.atk;
  },
  speed: 45,
  typeName: "Nature",
  typeId: 3,
  abilities: [
    {
      name: "Vine Grip",
      speed: 1.1,
      atk: 20,
    },
    {
      name: "Grass Shield",
      speed: 1.65,
      def: 25,
    },
  ],
};


/*
Welcome and choosing the characters
*/

const ALLCHAR = [CHAR1, CHAR2, CHAR3];
const ALLCHARNAMES = [
  "[1] " + CHAR1.name,
  "[2] " + CHAR2.name,
  "[3] " + CHAR3.name,
];

let playerHp = 500;                                        // defining some essential variables for the game to work
let enemyHp= 500;
let enemyChar= ALLCHAR[randomNumber(1,ALLCHAR.length-1)];
let playerChar; 
let playerAbility;
let enemyAbility;
let playerAbilityList = []

chooseChar()
function chooseChar() {                          // makes the player choose a character and starts the game 
  prompt.start();
  console.log("Choose a character out of the following: " + ALLCHARNAMES + ".");
  prompt.get(["character id"], function (err, result) {
    for (const e of ALLCHAR) {
      if (result["character id"] == e["id"]) {
        console.log("You have chosen " + e.name + ".");
        console.log(`Your enemy will be ${enemyChar.name}.`)
        playerChar = e
        createAbilityList(playerChar)
        console.log("Game Starting...")
        console.log(`
        
        
        `)
        setTimeout(gameLoop, 1000)
    }
  }
  if (playerChar == undefined) {
    console.log("Character undefined, please choose an existing character id.")
    chooseChar()
  }
})};



/*
Game Loop Functions 
*/


function gameLoop() {           // main game loop
  checkEnd()
  startRound()
}

function createAbilityList(char) {          //creates a list of all abilities             
  for (const e of char.abilities) {         // this will be used to check if the ability selected is valid
    playerAbilityList.push(e.name)
  } 
}

function checkEnd() {                      // check if someone died
  if (playerHp<=0 || enemyHp<=0) {
    return (playerHp<=0)? console.log(`You have lost.`) : console.log(`You have won.`) 
  }
}

function startRound() {                   // starts the round and prompts the player to select an ability
  console.log(`Choose an ability to use from the following: `)
  listAbilities(playerChar.abilities)
  abilityPrompt()
}


function listAbilities(abilities) {      // goes with startRound() (line 155), displays ability name and attributes of the character
  for (const f of abilities) {
    console.log(`{Ability Name: ${f.name}, Speed: ${f.speed}, ${f.atk || f.def}}`)
  }
}

function abilityPrompt() {              // goes with startRound() (line 155), asks the user to input the wanted ability
  prompt.start()
  prompt.get([`ability name`], function(err, result) {
    let abilityChosen=false
    for (const e of playerAbilityList) {
      // console.log(result["ability name"])
      // console.log(e)
      if (result["ability name"]==e) {
        console.log(`${playerChar.name} will use ${result["ability name"]}`)
        playerAbility=result["ability name"]
        abilityChosen=true
      } 
    }
    if (!abilityChosen) {
      console.log("Please input a valid ability.")
      abilityPrompt()
    }
})}