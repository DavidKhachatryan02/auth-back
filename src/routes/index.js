const express = require("express");
const authController = require("../controllers/auth.controller");
const { isUserExists } = require("../middlewares/isUserExists");
const { loginValidation } = require("../middlewares/loginValidation");
const { registerValidation } = require("../middlewares/registerValidation");
const { isAuthorized } = require("../middlewares/isAuthorized");

const authRouter = express.Router();

authRouter.post("/login", loginValidation, authController.login);
authRouter.post(
  "/register",
  registerValidation,
  isUserExists,
  authController.register
);
authRouter.get("/me", isAuthorized, authController.getMe);

authRouter.post("/google", authController.signInWithGoogle);

module.exports = authRouter;
