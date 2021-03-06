const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = Schema({
    email: String,
    name: String,
    subject: String,
    readed: Boolean,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", ContactSchema);