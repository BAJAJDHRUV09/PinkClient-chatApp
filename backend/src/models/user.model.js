import mongoose from "mongoose";

// JS object(class) created using mongoose.model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    profilePic: { type: String, default: "" }
}, { timestamps: true });

// User is the name of the schema mongoDB autoconverts it to users
// creates a users collection in DB if not already there
const User = mongoose.model("User", userSchema);

export default User;