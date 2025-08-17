const mongoose = require("mongoose");

// Define schema
const authSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,   
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6   
    }
}, { timestamps: true });


const UserModel = mongoose.model("User", authSchema);

module.exports = UserModel;
