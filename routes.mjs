import jsSHA from 'jssha';
import db from './models/index.mjs';

import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

const SALT = 'ludo';

const getHash = (input) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhashedString = `${input}-${SALT}`;
  shaObj.update(unhashedString);
  return shaObj.getHash('HEX');
};

const checkAuth = (req, res, next) => {
  req.isUserLoggedIn = false;
  if (req.cookies.loggedIn && req.cookies.userId) {
    const hash = getHash(req.cookies.userId);
    if (req.cookies.loggedInHash === hash) {
      req.isUserLoggedIn = true;
      next();
    } else {
      next();
    }
  } else {
    next();
  }
};

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const UsersController = initUsersController(db);

  app.get('/', checkAuth, GamesController.index);
  app.get('/login', checkAuth, UsersController.root);
  app.post('/login', UsersController.login);
  app.post('/games/restore', GamesController.restore);
  app.post('/games', GamesController.create);
  app.put('/games/roll-dice/:gameId', GamesController.rollDice);
  app.put('/games/move/:color/:pieceId/:gameId', GamesController.movePlayerPiece);
  app.post('/logout', GamesController.logout);
}
