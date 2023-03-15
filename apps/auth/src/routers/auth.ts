import express from 'express'

const router = express.Router();

router.get("/me", (req, res) => {
  return res.json({
    message: "Hello World"
  })
});

export default router;
