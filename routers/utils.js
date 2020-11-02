const express = require("express");
const UtilsController = require("../controllers/utils");
const api = express.Router();

api.get("/connection", UtilsController.connection);
api.get("/messages-status", UtilsController.messagesStatus);
api.post("/reload-messages-true", UtilsController.reloadMessagesTrue);
api.post("/reload-messages-false", UtilsController.reloadMessagesFalse)
api.post("/create-util", UtilsController.createUtil);

module.exports = api;