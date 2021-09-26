import express from "express";
import multer from "multer";
const upload = multer();
const router = express.Router();
import { userDirManager } from "./../lib/userDirManager.js";

const fileManager = new userDirManager(`${process.cwd()}/user-files`);

router.get("/files", async (req, res) => {
  res.json({
    files: fileManager.files,
    fileHashes: [...fileManager.fileHashes.keys()],
  });
});

router.post("/create", upload.single("user-file"), async (req, res) => {
  const file = await fileManager.createFile(
    req.file?.originalname,
    req.file?.buffer
  );
  if (file) {
    res.json({ fileCreated: true });
  } else {
    res.json({ fileCreated: false });
  }
});

export { router as api };
