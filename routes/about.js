// Import Express
const express = require("express");
// Create router object
const router = express.Router();


router.get("/", (req, res, next) => {
  res.render("about", { title: "About Us", user: req.user });
});

// Export it
module.exports = router;
