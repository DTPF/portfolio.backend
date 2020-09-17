const express = require("express");
const ContactController = require("../controllers/contact");

const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/contact-me/", ContactController.contactMe);
api.get("/get-contact-messages/", [md_auth.ensureAuth], ContactController.getMessages);
api.get("/get-contact-messages-readed/", [md_auth.ensureAuth], ContactController.getMessagesUnread);

module.exports = api;