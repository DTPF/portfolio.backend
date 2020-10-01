const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EducationSchema = Schema({
    title: {
        unique: true,
        type: String,
    },
    description: String,
    duration: Number,
    date: Date,
    image: String,
    tags: []
});

module.exports = mongoose.model('Education', EducationSchema);