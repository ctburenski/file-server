import express from "express";
const router = express.Router();

router.get("/:authStr", (req, res, next) => {
  let match = true;
  let lengthMatch = false;
  const length = req.params.authStr.length;

  if (length === 11) {
    lengthMatch = true;
  } else {
    lengthMatch = false;
  }

  for (let i = 0; i < length; i++) {
    if (req.params.authStr[i] !== "abcdefghijk"[i]) {
      match = false;
    }
  }

  if (match && lengthMatch) {
    next();
  } else {
    return res.status(401).send("Not authorized");
  }
});

export { router as auth };
