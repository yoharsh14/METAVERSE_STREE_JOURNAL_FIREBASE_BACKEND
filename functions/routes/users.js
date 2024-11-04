const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/users");
router.get("/", (req, res) => {
  console.log("Auth Router");
  res.send("API AUTH ROUTER");
});

router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout);

module.exports = router;
