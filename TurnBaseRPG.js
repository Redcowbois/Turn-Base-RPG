var prompt = require("prompt"); // starts the prompt package (makes user input easier)

function randomNumber(min, max) {
  // this function makes it easier to create a range of numbers
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* 
Defining all the characters 
*/

// character1, fire type
const CHAR1 = {
  name: "FireChar",
  id: 1,
  atk: Math.floor(randomNumber(55, 65)),
  def() {
    return 10 + 100 - this.atk;
  },
  speed: 40,
  typeName: "Fire",
  typeId: 1,
  abilities: [
    {
      name: "Flamethrower",
      speed: 1.04,
      atk: 30,
      category: "Atk"
    },
    {
      name: "Molten Shield",
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
  atk: Math.floor(randomNumber(30, 40)),
  def() {
    return 10 + 100 - this.atk;
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
  atk: Math.floor(randomNumber(45, 55)),
  def() {
    return 10 + 100 - this.atk;
  },
  speed: 50,
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
Defining essential variables
*/

const ALLCHAR = [CHAR1, CHAR2, CHAR3];                     
const ALLCHARNAMES = [
  "[1] " + CHAR1.name,
  "[2] " + CHAR2.name,
  "[3] " + CHAR3.name,
];


// defining some essential variables for the game to work
let enemyHp= 200;                                                   //the total health
let enemyChar= ALLCHAR[randomNumber(0, ALLCHAR.length-1)];          // chooses a random char out of the selection
let enemyAbility;                                                   // ability chosen (changes each round) 
let enemyRoundDamage;                                               // ability damage (changes each round)
let enemyDamageTaken;                                               // final damage - after multipliers and stuff (changes each round)

let playerHp = 200;   
let playerChar; 
let playerAbility;
let playerRoundDamage;
let playerDamageTaken;

let roundCount = 0;
let playerAbilityList = [];
let ended = false;


/*
Character choosing
*/

chooseChar()
function chooseChar() {                                        // makes the player choose a character and starts the game 
  prompt.start();
  console.log("Choose a character out of the following: " + ALLCHARNAMES + ".");
  prompt.get(["character id"], function (err, result) {
    for (const e of ALLCHAR) {
      if (result["character id"] == e["id"]) {
        playerChar = e
        for (const ability of playerChar.abilities) {         // array used to check if chosen ability valid later 
          playerAbilityList.push(ability)
        } 

        console.log(``)                                       // below is just text
        console.log("You have chosen " + e.name + ".");
        console.log(`(Atk: ${e.atk}, Def: ${e.def()}, Speed: ${e.speed}, Type: ${e.typeName})`)
        console.log(``)
        console.log(`Your enemy will be ${enemyChar.name}.`)
        console.log(`(Atk: ${enemyChar.atk}, Def: ${enemyChar.def()}, Speed: ${enemyChar.speed}, Type: ${enemyChar.typeName})`)
        console.log(``)
        console.log("Game Starting...")
        setTimeout(() => {
          console.log(``)
          console.log(``)
          console.log(`==========`);
          console.log(`  FIGHT!`);
          console.log(`==========`)}, 3499)                        
        setTimeout(startRound, 3500)          
    }
  }
  if (playerChar == undefined) {                  //runs the function again if id invalid
    console.log("Character undefined, please choose an existing character id.")
    chooseChar()
  }
})};


/*
Game Loop Functions 
*/

function startRound() {                     // starts the round and prompts the player to select an ability
  roundCount++

  console.log(`  ========`)
  console.log(`-= ROUND ${roundCount} =- `)
  console.log(`  ========`)
  console.log(``)
  console.log(`Choose an ability to use from the following: `)
  for (const f of playerChar.abilities) {   // lists abilities that can be chosen 
    console.log(`{Ability Name: ${f.name}, Speed Multiplier: ${f.speed}, ${f.category}: ${f.atk || f.def}}`)
  }
  console.log(``)

  abilityPrompt()
}

function abilityPrompt() {              // goes with startRound() (around line 168), asks the user to input the wanted ability
  prompt.start()
  prompt.get([`ability name`], function(err, result) {
    let abilityChosen=false
    for (const e of playerAbilityList) {
      if (result["ability name"]==e.name) {
        playerAbility=e
        abilityChosen=true
        enemyAbility = enemyChar.abilities[randomNumber(0, enemyChar.abilities.length-1)]
        fightLoop()
      } 
    } 
    if (!abilityChosen) {
      console.log("Please input a valid ability.")
      abilityPrompt()
    }
})}

function fightLoop() {                      // goes with abilityPrompt() (around line 184), deals damage according to abilities
  playerAttack()
  enemyAbility = enemyChar.abilities[randomNumber(0, enemyChar.abilities.length-1)]
  enemyAttack()
  checkShielded()
  playerDamageTaken = Math.ceil(applyTypeMultiplier(playerDamageTaken, enemyChar, playerChar))
  enemyDamageTaken = Math.ceil(applyTypeMultiplier(enemyDamageTaken, playerChar, enemyChar))

  console.log("")
  console.log(`Your ${playerChar.name} uses ${playerAbility.name}.`)
  console.log(`The enemy ${enemyChar.name} uses ${enemyAbility.name}.`)
  console.log("")
  console.log(`You have taken ${playerDamageTaken} damage.`)
  console.log(`The enemy has taken ${enemyDamageTaken} damage.`)

  applyDamage()
}

function playerAttack() {                // goes with fightLoop() (around line 202), calculates the dmg dealt
  playerRoundDamage=0
  switch(playerAbility.category){
    case "Atk":
      playerRoundDamage = Math.ceil(25*Math.log10((playerChar.atk+10))) + playerAbility.atk          //playerChar.atk is scaled using 25*log((x+10)) to implement diminishing returns   
      break
    case "Def":
      playerRoundDamage = -(Math.ceil(25*Math.log10((playerChar.def()+10))) + playerAbility.def + 10)          //playerChar.def is scaled using 25*log((x+10)) to implement diminishing returns
      break
  } 
}

function enemyAttack() {                // goes with fightLoop() (around line 202), calculates the dmg dealt
  enemyRoundDamage=0
  switch(enemyAbility.category){
    case "Atk":
      enemyRoundDamage = Math.ceil(25*Math.log10((enemyChar.atk+10))) + enemyAbility.atk                   //playerChar.atk is scaled using 25*log((x+10)) to implement diminishing returns
      break
    case "Def":
      enemyRoundDamage = -(Math.ceil(25*Math.log10((enemyChar.def()+10))) + enemyAbility.def + 10)          //playerChar.def is scaled using 25*log((x+10)) to implement diminishing returns
      break
  }
}

function checkShielded() {             // goes with fightLoop() (around line 202), check if 1/2 chars are shielded or not and applies healing
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
    console.log("")
    console.log("Both were shielded, applying brain damage.")
    playerDamageTaken = -(playerRoundDamage/2)
    enemyDamageTaken = -(enemyRoundDamage/2)
  }
}

function applyTypeMultiplier(damage, fromChar, toChar) {     // goes with fightLoop() (around line 202), applies a multiplier to the damage depending on the type
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
    default: 
      "Character type not detected, go fix your code lmao"
  }
  return damage
}

function applyDamage() {                 // goes with fightLoop() (around line 202), applies the damage depending on speed and checks if anyone has died
  if (playerChar.speed*playerAbility.speed == enemyChar.speed*enemyAbility.speed) {   // if speeds are equal its 50/50 who goes first 
    if (Math.random() < 0.5 ) {
      playerHp -= playerDamageTaken
      checkEnd()
      enemyHp -= enemyDamageTaken
      checkEnd()
      if (!ended) {
        showHp()
        setTimeout(startRound, 1000)
      } else {
        console.log("");
        console.log("");
        console.log("");
        showHp();
        (playerHp<=0)? 
        (console.log("========================"),
        console.log(`You have lost.`),
        console.log("========================")): 
        (console.log("========================"),
        console.log(`You have won. `),
        console.log("========================"))
      }
      
    } else {
      enemyHp -= enemyDamageTaken
      checkEnd()
      playerHp -= playerDamageTaken
      checkEnd()
      if (!ended) {
        showHp()
        setTimeout(startRound, 1000)
      } else {
        console.log("");
        console.log("");
        console.log("");
        showHp();
        (playerHp<=0)? 
        (console.log("========================"),
        console.log(`You have lost.`),
        console.log("========================")): 
        (console.log("========================"),
        console.log(`You have won. `),
        console.log("========================"))
      }
    }
  } 
  else if (playerChar.speed*playerAbility.speed < enemyChar.speed*enemyAbility.speed) {            //if the player is slower
    playerHp -= playerDamageTaken
    checkEnd()
    enemyHp -= enemyDamageTaken
    checkEnd()
    if (!ended) {
      showHp()
      setTimeout(startRound, 1000)
    } else {
      console.log("");
      console.log("");
      console.log("");
      showHp();
      (playerHp<=0)? 
      (console.log("========================"),
      console.log(`You have lost.`),
      console.log("========================")): 
      (console.log("========================"),
      console.log(`You have won. `),
      console.log("========================"))
    }
  }
  else {                                                              // if the player is faster
    enemyHp -= enemyDamageTaken
    checkEnd()
    playerHp -= playerDamageTaken
    checkEnd()
    if (!ended) {
      showHp()
      setTimeout(startRound, 1000)
    } else {
      console.log("");
      console.log("");
      console.log("");
      showHp();
      (playerHp<=0)? 
      (console.log("========================"),
      console.log(`You have lost.`),
      console.log("========================")): 
      (console.log("========================"),
      console.log(`You have won. `),
      console.log("========================"))
    }
  }
}

function checkEnd() {                       // goes with applyDamage() (around line 304), check if someone died
  if (playerHp<=0 || enemyHp<=0) {
    ended=true
  } 
}

function showHp() {                         //  goes with applyDamage() (around line 304), shows the current hp 
  console.log("")
  console.log("-------------------------------------") 
  console.log(`You now have ${playerHp} health.`)
  console.log(`The enemy now has ${enemyHp} health.`)
  console.log("-------------------------------------")
  console.log("")
}
