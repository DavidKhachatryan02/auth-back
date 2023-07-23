const jwt = require("jsonwebtoken");
const prisma = require("../services/prisma");
const { InvalidCredentialsError } = require("../errors");
const { JWT_SECRET_KEY } = require("../constants/config");

const verifyAuthToken = async (accessToken) => {
  try {
    return await jwt.verify(accessToken, JWT_SECRET_KEY);
  } catch (e) {
    throw new Error(e);
  }
};

const deleteUserPassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const isAuthorized = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken) {
      return next(new InvalidCredentialsError());
    }

    const { id } = await verifyAuthToken(accessToken);

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return next(new InvalidCredentialsError());
    }

    req.user = deleteUserPassword(user);

    next();
  } catch (e) {
    console.log(`[middleware]: Error on isAuthorized middleware error => ${e}`);
    next(e);
  }
};

module.exports = {
  isAuthorized,
};
