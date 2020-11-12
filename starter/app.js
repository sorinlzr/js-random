/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
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
  
  $("#score-0, #score-1, #current-0, #current-1").text("0");
  $("#name-0").text("Player 1");
  $("#name-1").text("Player 2");
  $(".player-0-panel, .player-1-panel").removeClass("winner active");
  $(".player-0-panel").addClass("active");
  
  $(".dice").hide();
}

function switchPlayer() {
  tempScore = 0;
  currentRoll = 0;
  previousRoll = 0;
  
  $("#current-" + activePlayer).text("0");
  $(".player-0-panel, .player-1-panel").toggleClass("active");

  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
}
var diceRoll = function () {
  return (diceVal = Math.floor(Math.random() * 6) + 1);
};

$(".btn-roll").click(function() {
  if (!gameFinished) {
    $("#score-0, #score-1").removeClass("reset");
    
    currentRoll !== 0 ? previousRoll = currentRoll : previousRoll = 0;
    currentRoll = diceRoll();
    
    $(".dice").show();
    $(".dice").prop("src", "img/dice-" + currentRoll + ".png")
    
    if (currentRoll !== 1) {
      tempScore += currentRoll;
      $("#current-" + activePlayer).text(tempScore);
    } else {
      switchPlayer();
    }
  }
});

$(".btn-hold").click(function() {
  if (!gameFinished) {
    scores[activePlayer] += tempScore;
    
    $("#score-" + activePlayer).text(scores[activePlayer]);
    
    if (scores[activePlayer] >= 100) {
      $("#name-" + activePlayer).text("Winner!");
      $(".dice").hide();
      $(".player-" + activePlayer + "-panel").addClass("winner");
      $(".player-" + activePlayer + "-panel").removeClass("active");
      gameFinished = true;
      
    } else {
      $(".dice").hide();
      switchPlayer();
    }
  }
});

$(".btn-new").click(init);
