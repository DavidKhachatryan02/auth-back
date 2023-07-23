const prisma = require("../services/prisma");
const { UserAlreadyExistsError } = require("../errors/auth");

const isUserExists = async (req, _res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return next(new UserAlreadyExistsError(email));
    }

    next();
  } catch (e) {
    console.error(
      `[middleware]: Error on isUserExists middleware error => ${e}`
    );
    next(e);
  }
};

module.exports = {
  isUserExists,
};
