import express from "express";
import path from "path";
import serveStatic from "serve-static";
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

app.use(
  "/static",
  serveStatic(path.join(process.cwd(), "user-files"), {
    cacheControl: true,
    immutable: true,
    maxAge: 1000 * 60 * 60 * 48,
  })
);

app.use(assetsMiddleware, prerenderedMiddleware, kitMiddleware);

app.listen(3000, () => console.log("Listening on 3000"));
