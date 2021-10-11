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
        type: Number,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
})
const Hat = mongoose.model("Product", hatsSchema)
module.exports = Hat