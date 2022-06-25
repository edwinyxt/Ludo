import db from './models/index.mjs';

import initGamesController from './controllers/games.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  // main page
  app.get('/', GamesController.index);

  app.post('/games/restore', GamesController.restore);
  // create a new game
  app.post('/games', GamesController.create);
  // update a game with new cards
  // app.put('/games/:id/deal', GamesController.deal);

  app.put('/games/roll-dice/:gameId', GamesController.rollDice);

  app.put('/games/move/:color/:pieceId/:gameId', GamesController.movePlayerPiece);
}
