let gameStateToUpdate = null;

let diceNumRolled;
let canMovePiece;
let canRollDice;
let numPlayers;
let activePlayers;
let currentPlayerTurn;
let playerPieceStatus;
let playerPositions;
let occupiedStepsTracker;
let playerCompletedPiecesTracker;

const playerPaths = {
  red: [19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 24, 25, 26, 27, 28, 29, 41, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 47, 46, 45, 44, 43, 42, 30, 31, 32, 33, 34, 35],
  green: [5, 8, 11, 14, 17, 24, 25, 26, 27, 28, 29, 41, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 47, 46, 45, 44, 43, 42, 30, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 4, 7, 10, 13, 16],
  blue: [66, 63, 60, 57, 54, 47, 46, 45, 44, 43, 42, 30, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 24, 25, 26, 27, 28, 29, 41, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 67, 64, 61, 58, 55],
  yellow: [52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 47, 46, 45, 44, 43, 42, 30, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 24, 25, 26, 27, 28, 29, 41, 40, 39, 38, 37, 36],
}; // static

const extractGameState = function () {
  diceNumRolled = gameStateToUpdate.diceNumRolled;
  canMovePiece = gameStateToUpdate.canMovePiece;
  canRollDice = gameStateToUpdate.canRollDice;
  numPlayers = gameStateToUpdate.numPlayers;
  activePlayers = gameStateToUpdate.activePlayers;
  currentPlayerTurn = gameStateToUpdate.currentPlayerTurn;
  playerPieceStatus = gameStateToUpdate.playerPieceStatus;
  playerPositions = gameStateToUpdate.playerPositions;
  occupiedStepsTracker = gameStateToUpdate.occupiedStepsTracker;
  playerCompletedPiecesTracker = gameStateToUpdate.playerCompletedPiecesTracker;
};

const updateGameState = function () {
  gameStateToUpdate.diceNumRolled = diceNumRolled;
  gameStateToUpdate.canMovePiece = canMovePiece;
  gameStateToUpdate.canRollDice = canRollDice;
  gameStateToUpdate.numPlayers = numPlayers;
  gameStateToUpdate.activePlayers = activePlayers;
  gameStateToUpdate.currentPlayerTurn = currentPlayerTurn;
  gameStateToUpdate.playerPieceStatus = playerPieceStatus;
  gameStateToUpdate.playerPositions = playerPositions;
  gameStateToUpdate.occupiedStepsTracker = occupiedStepsTracker;
  gameStateToUpdate.playerCompletedPiecesTracker = playerCompletedPiecesTracker;
};

const isPlayerPositionBlock = function (pieceColor, playerPosition) {
  const stepLocation = playerPaths[pieceColor][playerPosition];
  const stepOccupant = occupiedStepsTracker[stepLocation];

  if (stepOccupant != null) {
    if (stepOccupant.length > 2 && stepOccupant[0] != pieceColor) {
      return true;
    }
  }
  return false;
};

const updatePlayerPosition = function (pieceColor, playerPieceNum) {
  if (playerPositions[pieceColor][playerPieceNum] > 56) {
    const residualSteps = playerPositions[pieceColor][playerPieceNum] - 56;
    playerPositions[pieceColor][playerPieceNum] = 56 - residualSteps;
  }
};

const updateOccupiedSteps = function (pieceColor, playerPieceNum) {
  if (playerPieceStatus[pieceColor][playerPieceNum] === 'in_play') {
    const currentStepLocation = playerPaths[pieceColor][playerPositions[pieceColor][playerPieceNum]];
    if (occupiedStepsTracker[currentStepLocation].length > 2) {
      occupiedStepsTracker[currentStepLocation].pop();
    } else {
      delete occupiedStepsTracker[currentStepLocation]; }

    for (let i = 1; i <= diceNumRolled; i++) {
      const nextPlayerPosition = playerPositions[pieceColor][playerPieceNum] + 1;
      if (isPlayerPositionBlock(pieceColor, nextPlayerPosition)) { break; }
      playerPositions[pieceColor][playerPieceNum]++;
    }
  }
  if (playerPieceStatus[pieceColor][playerPieceNum] === 'base') {
    const nextPlayerPosition = playerPositions[pieceColor][playerPieceNum] + 1;

    if (isPlayerPositionBlock(pieceColor, nextPlayerPosition)) {
      return; // auto pass turn if no piece can legally move due to 1st step block
    }
    playerPieceStatus[pieceColor][playerPieceNum] = 'in_play';
    playerPositions[pieceColor][playerPieceNum]++;
  }

  if (playerPositions[pieceColor][playerPieceNum] === 56) {
    playerPieceStatus[pieceColor][playerPieceNum] = 'completed';
    playerCompletedPiecesTracker[pieceColor]++;
    return;
  }
  updatePlayerPosition(pieceColor, playerPieceNum); // fix end step overflow
  const destStepLocation = playerPaths[pieceColor][playerPositions[pieceColor][playerPieceNum]];

  if (occupiedStepsTracker[destStepLocation] != null) {
    const destOccupiedPieceColor = occupiedStepsTracker[destStepLocation][0];
    const destOccupiedPieceNum = occupiedStepsTracker[destStepLocation][1];

    if (destOccupiedPieceColor != pieceColor) {
      playerPieceStatus[destOccupiedPieceColor][destOccupiedPieceNum] = 'base';
      playerPositions[destOccupiedPieceColor][destOccupiedPieceNum] = -1;
      occupiedStepsTracker[destStepLocation] = [pieceColor, playerPieceNum];
    }
    else {
      occupiedStepsTracker[destStepLocation].push(playerPieceNum);
    }
  }
  else {
    occupiedStepsTracker[destStepLocation] = [pieceColor, playerPieceNum];
  }
};

const executePieceMovements = function (pieceColor, playerPieceNum) {
  if (playerPieceStatus[pieceColor][playerPieceNum] === 'base' && diceNumRolled === 6) {
    updateOccupiedSteps(pieceColor, playerPieceNum);

    diceNumRolled = 0;
    canMovePiece = false;
    canRollDice = true;
    return;
  }
  if (playerPieceStatus[pieceColor][playerPieceNum] === 'in_play') {
    updateOccupiedSteps(pieceColor, playerPieceNum);

    canMovePiece = false;

    // check final winning condition, down to last player?
    if (playerCompletedPiecesTracker[pieceColor] === 4) {
      const nextPlayerIndex = (activePlayers.indexOf(currentPlayerTurn) + 1) % numPlayers;

      if (numPlayers > 2) {
        currentPlayerTurn = activePlayers[nextPlayerIndex];

        diceNumRolled = 0;
        canRollDice = true;

        numPlayers--;
        activePlayers = activePlayers.filter((player) => player != pieceColor);
      } else { diceNumRolled = 'Game Completed';
      }
    }

    else if (diceNumRolled != 6) {
      const nextPlayerIndex = (activePlayers.indexOf(currentPlayerTurn) + 1) % numPlayers;

      currentPlayerTurn = activePlayers[nextPlayerIndex];

      diceNumRolled = 0;
      canRollDice = true;
    } else {
      diceNumRolled = 0;
      canRollDice = true; }
  }
};

export default function initGamesController(db) {
  const index = (request, response) => {
    response.render('games/index');
  };

  const restore = async (request, response) => {
    try {
      const game = await db.Game.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']],
      });

      response.send({
        id: game[0].id,
        gameState: game[0].gameState,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  const create = async (request, response) => {
    diceNumRolled = null;
    canMovePiece = false;
    canRollDice = true;
    numPlayers = 2;
    activePlayers = ['red', 'green'];
    currentPlayerTurn = 'red';
    playerPieceStatus = {
      red: ['base', 'base', 'base', 'base'],
      green: ['base', 'base', 'base', 'base'],
      blue: ['base', 'base', 'base', 'base'],
      yellow: ['base', 'base', 'base', 'base'], // 'in_play' 'completed'
    };
    playerPositions = {
      red: [-1, -1, -1, -1],
      green: [-1, -1, -1, -1],
      blue: [-1, -1, -1, -1],
      yellow: [-1, -1, -1, -1],
    };

    occupiedStepsTracker = {};

    playerCompletedPiecesTracker = {
      red: 0,
      green: 0,
      blue: 0,
      yellow: 0,
    };
    const newGame = {
      gameState: {
        diceNumRolled,
        canMovePiece,
        canRollDice,
        numPlayers,
        activePlayers,
        currentPlayerTurn,
        playerPieceStatus,
        playerPositions,
        occupiedStepsTracker,
        playerCompletedPiecesTracker,
      },
    };

    try {
      const game = await db.Game.create(newGame);

      response.send({
        id: game.id,

        gameState: game.gameState,

      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  const rollDice = async (request, response) => {
    const game = await db.Game.findByPk(request.params.gameId);

    gameStateToUpdate = { ...game.gameState };

    extractGameState();

    diceNumRolled = 1 + Math.floor(Math.random() * 6);
    canRollDice = false;

    if (diceNumRolled < 6 && !playerPieceStatus[currentPlayerTurn].includes('in_play')) {
      const nextPlayerIndex = (activePlayers.indexOf(currentPlayerTurn) + 1) % numPlayers;

      currentPlayerTurn = activePlayers[nextPlayerIndex];

      canRollDice = true;
    } else { canMovePiece = true; }
    updateGameState();
    await game.update({
      gameState: gameStateToUpdate,

    });

    response.send({
      id: game.id,
      gameState: game.gameState,
    });
  };

  const movePlayerPiece = async (request, response) => {
    const game = await db.Game.findByPk(request.params.gameId);
    gameStateToUpdate = { ...game.gameState };
    extractGameState();
    const pieceColor = request.params.color;
    const playerPieceNum = request.params.pieceId;
    if (currentPlayerTurn === pieceColor && canMovePiece) {
      executePieceMovements(pieceColor, playerPieceNum);
      updateGameState();
      await game.update({
        gameState: gameStateToUpdate,

      });

      response.send({
        id: game.id,
        gameState: game.gameState,
      });
    }
  };

  return {
    create,
    index,
    rollDice,
    movePlayerPiece,
    restore,
  };
}
