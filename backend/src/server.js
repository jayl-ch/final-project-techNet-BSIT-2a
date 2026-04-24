const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const {
  notFoundHandler,
  errorHandler,
} = require("./modules/middlewares/error.middleware");

const app = express();

const routers = [
  require("./modules/routes/student.router"),
  require("./modules/routes/group.router"),
  require("./modules/routes/task.router"),
];

const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));

routers.forEach((router) => {
  app.use("/api", router);
});

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  const port = process.env.PORT;
  const uri = process.env.MONGO_URI_LOCAL;

  await connectDB(uri);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start();
