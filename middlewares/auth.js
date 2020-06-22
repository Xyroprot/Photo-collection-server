const jwt = require('jsonwebtoken');
const secretWord = require('../controllers/users');

const auth = (req, res, next) => {
  const { token } = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, secretWord);
  } catch {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};

module.exports = auth;
