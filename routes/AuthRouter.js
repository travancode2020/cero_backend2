const express = require("express");

const { sessionLogin, sessionLogout } = require("../controllers/auth/main.js");

const AuthRouter = express.Router();

AuthRouter.post("/sessionLogin", sessionLogin);
AuthRouter.get("/sessionLogout", sessionLogout);

module.exports = AuthRouter