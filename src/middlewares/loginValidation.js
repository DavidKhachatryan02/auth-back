const Joi = require("joi");
const { ValidateionError } = require("../errors/auth");

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required(),
});

const loginValidation = (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      next(new ValidateionError());
      return;
    }
    next();
  } catch (e) {
    console.error(
      `[middleware]: Error on LoginValidation middleware error => ${e}`
    );
    next(e);
  }
};

module.exports = { loginValidation };
