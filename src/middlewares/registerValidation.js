const Joi = require("joi");
const { ValidateionError } = require("../errors/auth");

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  userName: Joi.string().required(),
  password: Joi.string().required(),
});

const registerValidation = (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    console.log(error);
    if (error) {
      next(new ValidateionError());
      return;
    }
    next();
  } catch (e) {
    console.error(
      `[middleware]: Error on registerValidation middleware error => ${e}`
    );
    next(e);
  }
};

module.exports = { registerValidation };
