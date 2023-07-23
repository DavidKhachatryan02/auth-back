class UserAlreadyExistsError extends Error {
  constructor(email) {
    super(`Email ${email} is taken.`);
  }
}

class UserNotExists extends Error {
  constructor(email) {
    super(`User with ${email} not found`);
  }
}

class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid login or password.");
  }
}

class ValidateionError extends Error {
  constructor() {
    super("Missing input Data");
  }
}

module.exports = {
  UserAlreadyExistsError,
  UserNotExists,
  InvalidCredentialsError,
  ValidateionError,
};
