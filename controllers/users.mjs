import jsSHA from 'jssha';

const SALT = 'ludo';

export default function initUsersController(db) {
  const root = (req, res) => {
    if (req.isUserLoggedIn === false) {
      res.render('login'); }

    else {
      res.render('games/index');
    }
  };

  const login = async (req, res) => {
    console.log(req.body);
    try {
      const user = await db.User.findOne({
        where: {
          email: req.body.email,
        },
      });
      console.log('user', user);

      const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
      shaObj.update(req.body.password);
      const hashedPassword = shaObj.getHash('HEX');
      console.log('hashed password', hashedPassword);

      if (hashedPassword === user.password) {
        const shaObj1 = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
        const unhashedCookieString = `${user.id}-${SALT}`;
        shaObj1.update(unhashedCookieString);
        const hashedCookieString = shaObj1.getHash('HEX');

        res.cookie('loggedInHash', hashedCookieString);
        res.cookie('loggedIn', true);
        res.cookie('userId', user.id);
        // res.send({ user });
        res.redirect('/');
      } else {
        console.log('not logged in ');
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return { root, login };
}
