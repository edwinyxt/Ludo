import db from './models/index.mjs';

import initGamesController from './controllers/games.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  app.get('/', GamesController.index);
  app.post('/games/restore', GamesController.restore);
  app.post('/games', GamesController.create);
  app.put('/games/roll-dice/:gameId', GamesController.rollDice);
  app.put('/games/move/:color/:pieceId/:gameId', GamesController.movePlayerPiece);
}
