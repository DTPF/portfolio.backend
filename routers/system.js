const express = require("express");
const SystemController = require("../controllers/system");
const api = express.Router();

api.get("/connection", SystemController.connection);

module.exports = api;