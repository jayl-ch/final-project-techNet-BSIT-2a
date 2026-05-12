const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

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
  require("./modules/routes/admin.router"),
];

const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));

routers.forEach((router) => {
  app.use("/api", router);
});

const distPath = path.resolve(__dirname, "../../frontend/dist");

if (fs.existsSync(distPath)) {
  app.use(
    express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (
          filePath.endsWith("sw.js") ||
          filePath.endsWith("manifest.webmanifest")
        ) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    }),
  );

  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  const port = process.env.PORT;
  const uri = process.env.MONGO_URI;

  await connectDB(uri);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start();
