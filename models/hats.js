const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const hatsSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    img: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
})
module.exports = mongoose.model("Hat", hatsSchema)
