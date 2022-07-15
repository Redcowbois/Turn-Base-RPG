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
      atk: 30,
      category: "Atk"
    },
    {
      name: "Fire Shield",
      speed: 1.5,
      def: 20,
      category: "Def"
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
      category: "Atk"
    },
    {
      name: "Water Shield",
      speed: 1.55,
      def: 35,
      category: "Def"
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
      category: "Atk"
    },
    {
      name: "Grass Shield",
      speed: 1.65,
      def: 25,
      category: "Def"
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


// defining some essential variables for the game to work
let enemyHp= 500;                                                   //the total health
let enemyChar= ALLCHAR[randomNumber(0, ALLCHAR.length-1)];          // chooses a random char out of the selection
let enemyAbility;                                                   // ability chosen (changes each round) 
let enemyRoundDamage;                                               // ability damage (changes each round)
let enemyDamageTaken;                                               // final damage - after multipliers and stuff (changes each round)

let playerHp = 500;   
let playerChar; 
let playerAbility;
let playerRoundDamage;
let playerDamageTaken;

let playerAbilityList = []
let roundCount = 0;

chooseChar()
function chooseChar() {                          // makes the player choose a character and starts the game 
  prompt.start();
  console.log("Choose a character out of the following: " + ALLCHARNAMES + ".");
  prompt.get(["character id"], function (err, result) {
    for (const e of ALLCHAR) {
      if (result["character id"] == e["id"]) {
        console.log(``)
        console.log("You have chosen " + e.name + ".");
        console.log(``)
        console.log(`Your enemy will be ${enemyChar.name}.`)
        console.log(``)
        playerChar = e
        createAbilityList(playerChar)
        setTimeout(() => {
          console.log("Game Starting...");
          console.log(`==========`);
          console.log(`  FIGHT!`);
          console.log(`==========`);
        }, 2)                           // set to delay 2000
        setTimeout(gameLoop, 4)          // set to delay 4000
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
  roundCount++
  console.log(``)
  console.log(``)
  console.log(`-=ROUND ${roundCount}=-`)
  console.log(``)
  checkEnd()
  startRound()
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
    console.log(`{Ability Name: ${f.name}, Speed: ${f.speed}, ${f.category}: ${f.atk || f.def}}`)
  }
}

function createAbilityList(char) {          //creates a list of all abilities             
  for (const e of char.abilities) {         // this will be used to check if the ability selected is valid
    playerAbilityList.push(e)
  } 
}

function abilityPrompt() {              // goes with startRound() (line 155), asks the user to input the wanted ability
  prompt.start()
  prompt.get([`ability name`], function(err, result) {
    let abilityChosen=false
    for (const e of playerAbilityList) {
      if (result["ability name"]==e.name) {
        console.log(`${playerChar.name} will use ${result["ability name"]}`)
        playerAbility=e
        abilityChosen=true
        chooseEnemyAbility()
        fightLoop()
      } 
    }
    if (!abilityChosen) {
      console.log("Please input a valid ability.")
      abilityPrompt()
    }
})}

function chooseEnemyAbility() {             // goes with abilityPrompt() (line 173), chooses the enemy ability
  enemyAbility = enemyChar.abilities[randomNumber(1, enemyChar.abilities.length-1)]
}

function fightLoop() {                      // goes with abilityPrompt() (line 173), deals damage according to abilities
  console.log(playerAbility.name, playerAbility.speed) // remove this in final version 
  console.log(enemyAbility.name, enemyAbility.speed)
  playerAttack()
  enemyAttack()
  checkShielded()
  applyTypeMultiplier(playerDamageTaken, enemyChar, playerChar)
  applyTypeMultiplier(enemyDamageTaken, playerChar, enemyChar)
  applyDamage()
}

function playerAttack() {                // goes with fightLoop() (line 212), calculates the dmg dealt
  playerRoundDamage=0
  switch(playerAbility.category){
    case "Atk":
      playerRoundDamage = Math.ceil(25*Math.log10((playerChar.atk+10))) + playerAbility.atk          //playerChar.atk is scaled using 25*log((x+10)) to implement diminishing returns
      console.log(`${playerChar.name} uses ${playerAbility.name} and does ${damage} damage!`) // remove these in final version
      break
    case "Def":
      playerRoundDamage = -(Math.ceil(25*Math.log10((playerChar.def()+10))) + playerAbility.def)          //playerChar.def is scaled using 25*log((x+10)) to implement diminishing returns
      console.log(`${playerChar.name} uses ${playerAbility.name} and does ${damage} damage!`)
  }
  
  return playerRoundDamage
}

function enemyAttack() {                // goes with fightLoop() (line 212), calculates the dmg dealt
  enemyRoundDamage=0
  switch(enemyAbility.category){
    case "Atk":
      enemyRoundDamage = Math.ceil(25*Math.log10((enemyChar.atk+10))) + vAbility.atk                   //playerChar.atk is scaled using 25*log((x+10)) to implement diminishing returns
      console.log(`${enemyChar.name} uses ${enemyAbility.name} and does ${damage} damage!`)
      break
    case "Def":
      enemyRoundDamage = -(Math.ceil(25*Math.log10((enemyChar.def()+10))) + enemyAbility.def)          //playerChar.def is scaled using 25*log((x+10)) to implement diminishing returns
      console.log(`${enemyChar.name} uses ${enemyAbility.name} and does ${damage} damage!`)
  }
  return enemyRoundDamage
}

function checkShielded() {             // goes with fightLoop() (line 212), check if 1/2 chars are shielded or not and applies healing
  playerDamageTaken = enemyRoundDamage
  enemyDamageTaken = playerRoundDamage
  if (playerRoundDamage>0 && enemyRoundDamage<0) {         //case: player atk and enemy shielded
    enemyDamageTaken = enemyRoundDamage + playerRoundDamage
    playerDamageTaken = 0    
  }
  if (playerRoundDamage<0 && enemyRoundDamage>0) {          //case: player shielded and enemy atk
    playerDamageTaken = playerRoundDamage + enemyRoundDamage
    enemyDamageTaken = 0  
  }
  if (playerRoundDamage<0 && enemyRoundDamage<0) {          //case: both shielded, will take dmg = shield value/2
    playerDamageTaken = -(playerRoundDamage/2)
    enemyDamageTaken = -(enemyRoundDamage/2)
  }
}

function applyTypeMultiplier(damage, fromChar, toChar) {     // goes with fightLoop() (line 212), applies a multiplier to the damage depending on the type
  switch(fromChar.typeName) {
    case "Fire":
      if (toChar.typeName=="Fire") {
        damage *= 1
      } 
      if (toChar.typeName=="Water") {
        damage *= 0.8
      } 
      if (toChar.typeName=="Nature") {
        damage *= 1.2
      } 
      break
    case "Water":
      if (toChar.typeName=="Fire") {
        damage *= 1.2
      } 
      if (toChar.typeName=="Water") {
        damage *= 1
      } 
      if (toChar.typeName=="Nature") {
        damage *= 0.8
      } 
      break
    case "Nature":
      if (toChar.typeName=="Fire") {
        damage *= 0.8
      } 
      if (toChar.typeName=="Water") {
        damage *= 1.2
      } 
      if (toChar.typeName=="Nature") {
        damage *= 0
      } 
      break

  }
  return damage
}

function applyDamage() {            // goes with fightLoop() (line 212), applies the damage depending on speed and checks if anyone has died

}
