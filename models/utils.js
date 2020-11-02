const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UtilsSchema = Schema({
    id: Number,
    reloadMessages: Boolean
});

module.exports = mongoose.model("Utils", UtilsSchema);