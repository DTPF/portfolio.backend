const express = require("express");
const ContactController = require("../controllers/contact");

const api = express.Router();

api.post("/contact-me/:email", ContactController.contactMe);

module.exports = api;