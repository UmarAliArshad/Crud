const mongoose = require("mongoose")
const userSchema = require("../schema/UserSchema")

const User = mongoose.model("users", userSchema)

module.exports = User