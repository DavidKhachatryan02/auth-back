const prisma = require("./services/prisma");
const express = require("express");
const authRouter = require("./routes");
const { errorHandler } = require("./errors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
