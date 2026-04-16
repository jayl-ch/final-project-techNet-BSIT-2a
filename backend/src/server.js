const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

const studentRouter = require("./modules/routes/student.router");
const groupRouter = require("./modules/routes/group.router");
const taskRouter = require("./modules/routes/task.router");

const app = express();

const routers = [studentRouter, groupRouter, taskRouter];

app.use(express.json());
app.use(helmet());
app.use(cors());

routers.forEach((router) => {
  app.use("/api", router);
});

async function start() {
  const port = process.env.PORT;
  const uri = process.env.MONGO_URI_LOCAL;

  await connectDB(uri);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start();
