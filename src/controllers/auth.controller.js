const { compare, hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../services/prisma");
const { InvalidCredentialsError, UserNotExists } = require("../errors/auth");
const { oAuthClient } = require("../services/oAuth");
const { JWT_SECRET_KEY, BCRYPT_SALT_ROUNDS } = require("../constants/config");

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET_KEY);

const deleteUserPassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const candidate = await prisma.user.findUnique({
      where: { email },
    });

    if (!candidate) {
      return next(new UserNotExists(email));
    }

    const isPasswordValid = await compare(password, candidate.password);

    if (!isPasswordValid) {
      return next(new InvalidCredentialsError());
    }

    const userWithoutPassword = deleteUserPassword(candidate);
    const accessToken = generateToken(candidate.id, JWT_SECRET_KEY);

    res.status(200).json({
      ...userWithoutPassword,
      accessToken,
    });

    next(null);
  } catch (e) {
    console.error(`login error ${e}`);
    next(e);
  }
};

const register = async (req, res, next) => {
  try {
    const { password, email, userName } = req.body;
    const passwordHash = await hash(password, BCRYPT_SALT_ROUNDS);

    const user = await prisma.User.create({
      data: {
        email,
        userName,
        password: passwordHash,
      },
    });

    const accessToken = generateToken(user.id, JWT_SECRET_KEY);

    const userWithoutPassword = deleteUserPassword(user);

    res.status(201).json({ ...userWithoutPassword, accessToken });
  } catch (e) {
    console.error(`Registration error ${e}`);
    next(e);
  }
};

const signInWithGoogle = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await oAuthClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub } = ticket.getPayload();

    const candidate = await prisma.user.findUnique({
      where: { email },
    });

    if (candidate) {
      const userWithoutPassword = deleteUserPassword(candidate);
      const accessToken = generateToken(candidate.id, JWT_SECRET_KEY);

      res.status(200).json({
        ...userWithoutPassword,
        accessToken,
      });

      return res.status(200).json({ ...userWithoutPassword, accessToken });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        userName: name,
        password: sub,
      },
    });

    const accessToken = generateToken(newUser.id, JWT_SECRET_KEY);

    const userWithoutPassword = deleteUserPassword(newUser);

    res.status(200).json({ ...userWithoutPassword, accessToken });
  } catch (e) {
    console.error(`Google Signin error ${e}`);
    next(e);
  }
};

module.exports = {
  getMe,
  login,
  register,
  signInWithGoogle,
};
