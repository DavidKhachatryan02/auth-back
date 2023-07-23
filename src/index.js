const prisma = require("./services/prisma");
const express = require("express");
const authRouter = require("./routes");
const { errorHandler } = require("./errors");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.use(express.json());
app.use("/auth", authRouter);
app.use(errorHandler);

const main = async () => {
  const APP_PORT = 3000;

  try {
    await prisma.$connect();

    app.listen(APP_PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${APP_PORT}`
      );
    });
  } catch (e) {
    console.error(`[server]: Error on initializing server => ${e}`);
  }
};

main().then();
