const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Forum API");
});

module.exports = router;
