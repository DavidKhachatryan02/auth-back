const {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserNotExists,
  ValidateionError,
} = require("./auth");

const errorHandler = (error, req, res, next) => {
  if (error) {
    switch (error.constructor) {
      case UserAlreadyExistsError:
        res.status(409).json({ message: error.message });
        break;
      case UserNotExists:
        res.status(400).json({ message: error.message });
        break;
      case InvalidCredentialsError:
        res.status(401).json({ message: error.message });
        break;
      case ValidateionError:
        res.status(401).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: error.message });
    }

    return;
  }

  next(null);
};

module.exports = {
  errorHandler,
};
