const jwt = require('jsonwebtoken');

const createJwt = ({payload}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 1000 * 60 * 60 * 24,
  });
  return token;

};

exports.isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

exports.attachCookiesToResponse = ({res, user}) => {
  const token = createJwt({payload: user});

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires : new Date(Date.now() + oneDay),
    signed: true
  });
};

