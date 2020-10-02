const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
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
    link: String,
    tags: []
});
EducationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Education', EducationSchema);