const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Reminder", reminderSchema);
