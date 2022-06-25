let currentGame = null;

const displayDiceResult = document.getElementById('achess-die');
const step = document.getElementsByClassName('astep');
const base = document.getElementsByClassName('player');
const controlPanel = document.getElementById('achess-controlpanel');

playerColors = {
  red: '#f7162d',
  green: '#00e34c',
  blue: '#04c3c9',
  yellow: '#f7bb05',
}; // static

playerBases = {
  red: [0, 1, 2, 3],
  green: [4, 5, 6, 7],
  blue: [8, 9, 10, 11],
  yellow: [12, 13, 14, 15],
}; // static

const restorelatestGameState = function () {
  axios.post('/games/restore').then((response) => {
    currentGame = response.data;
    renderGameState();
    console.log(currentGame);
  })
    .catch((error) => {
      console.log(error);
    });
};

const renderGameState = function () {
  console.log('rendering game state');
  for (let i = 0; i < 72; i++) {
    const { occupiedStepsTracker } = currentGame.gameState;
    if (occupiedStepsTracker[i] != null) {
      let stepContent = '';

      for (let j = 1; j < occupiedStepsTracker[i].length; j++) {
        stepContent += `<span onclick="movePlayerPiece(this, '${occupiedStepsTracker[i][0]}', ${occupiedStepsTracker[i][j]})" class='rp material-icons ${occupiedStepsTracker[i][0].charAt(0)}'>flight</span>`;
      }
      console.log(stepContent, 'stepContent');
      step[i].innerHTML = stepContent;
    } else { step[i].innerHTML = ''; }
  }

  for (const color in playerBases) {
    const pieceStatus = currentGame.gameState.playerPieceStatus[color];
    for (let i = 0; i < 4; i++) {
      if (pieceStatus[i] === 'in_play') {
        base[playerBases[color][i]].innerHTML = '';
      }
      if (pieceStatus[i] === 'base') {
        base[playerBases[color][i]].innerHTML = `<span onclick="movePlayerPiece(this, '${color}', ${i})" class='rp material-icons ${color.charAt(0)}'>flight</span>`;
      }
      if (pieceStatus[i] === 'completed') {
        base[playerBases[color][i]].innerHTML = `<span class='rp material-icons ${color.charAt(0)}'>stars</span>`;
      }
    }
  }
  setTimeout(() => {
    controlPanel.style.backgroundColor = playerColors[currentGame.gameState.currentPlayerTurn];

    displayDiceResult.innerHTML = currentGame.gameState.diceNumRolled;
  }, 500);
};

const createGame = function () {
  axios.post('/games')
    .then((response) => {
      currentGame = response.data;
      renderGameState();

      console.log(currentGame);
    })
    .catch((error) => {
      console.log(error);
    });
};

const rollDice = function () {
  if (currentGame.gameState.canRollDice) {
    axios.put(`/games/roll-dice/${currentGame.id}`)
      .then((response) => {
        currentGame = response.data;
        displayDiceResult.innerHTML = currentGame.gameState.diceNumRolled;
        if (!currentGame.gameState.canMovePiece) {
          setTimeout(() => {
            controlPanel.style.backgroundColor = playerColors[currentGame.gameState.currentPlayerTurn];
            displayDiceResult.innerHTML = 0;
          }, 500); }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const movePlayerPiece = function (clickedPiece, pieceColor, playerPieceNum) {
  if (currentGame.gameState.canMovePiece) {
    axios.put(`/games/move/${pieceColor}/${playerPieceNum}/${currentGame.id}`)
      .then((response) => {
        console.log(pieceColor, playerPieceNum);
        currentGame = response.data;
        renderGameState();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

restorelatestGameState();
