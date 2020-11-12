/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, tempScore, activePlayer, gameFinished, previousRoll;

init();

function init() {
  tempScore = 0;
  scores = [0, 0];
  activePlayer = 0;
  previousRoll = 0;
  currentRoll = 0;
  gameFinished = false;

  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");

  document.querySelector(".dice").style.display = "none";
}

function switchPlayer() {
  tempScore = 0;
  currentRoll = 0;
  previousRoll = 0;
  document.getElementById("current-" + activePlayer).textContent = "0";
  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
  document.querySelector(".dice").style.display = "none";
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
}
var diceRoll = function () {
  return (diceVal = Math.floor(Math.random() * 6) + 1);
};

document.querySelector(".btn-roll").addEventListener("click", function () {
  if (!gameFinished) {
    document.getElementById("score-0").classList.remove("reset");
    document.getElementById("score-1").classList.remove("reset");
    if(currentRoll !== 0){
      previousRoll = currentRoll;
    } else {
      previousRoll = 0;
    }
    currentRoll = diceRoll();
    var diceDOM = document.querySelector(".dice");

    diceDOM.style.display = "block";
    diceDOM.src = "dice-" + currentRoll + ".png";

    if(previousRoll === currentRoll){
      scores[activePlayer] = 0;
      document.getElementById("score-" + activePlayer).textContent = 0;
      document.getElementById("score-" + activePlayer).classList.add("reset");
      switchPlayer();
    }else if (currentRoll !== 1) {
      tempScore += currentRoll;
      document.getElementById("current-" + activePlayer).textContent = tempScore;
    } else {
      switchPlayer();
    }

  }
});

document.querySelector(".btn-hold").addEventListener("click", function () {
  if (!gameFinished) {
    scores[activePlayer] += tempScore;

    document.getElementById("score-" + activePlayer).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= 100) {
      document.querySelector("#name-" + activePlayer).textContent = "Winner!";
      document.querySelector(".dice").style.display = "none";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      gameFinished = true;
      
    } else {
      switchPlayer();
    }
  }
});

document.querySelector(".btn-new").addEventListener("click", init);
