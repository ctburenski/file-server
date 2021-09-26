import express from "express";
import {
  assetsMiddleware,
  prerenderedMiddleware,
  kitMiddleware,
} from "./build/middlewares.js";
import { api } from "./routes/api.js";
import cors from "cors";

const app = express();

app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.use("/api", api);

app.use("/static", express.static("user-files"));

app.use(assetsMiddleware, prerenderedMiddleware, kitMiddleware);

app.listen(3000, () => console.log("Listening on 3000"));
