const express = require("express");
const { login, createNewUser } = require("../controllers/user.controller");

const router = express.Router();

router.post('/login', login);
router.post('/create-new-user', createNewUser);


module.exports = router;