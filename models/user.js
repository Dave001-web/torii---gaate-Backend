const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    phoneNumber: {
      type: String,
      unique: true,
      match: /^\+?[1-9][0-9]{7,14}$/,
    },
    profilePicture: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhtMRbtowke9ZnnGtyYJmIuJaB2Q1y5I-3IA",
    },
    role:{
        type:String,
        enum: ["tenant", "landlord"],
        default: "tenant",
    },
    password:{
        type: String,
        minlength: [6, "Minimum password length is 6"],
        requried:[true, "Password is required"]
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetOasswordExpires: Date,
  },
  { timestamps: true }
);


const USER = mongoose.model("user", userSchema)
module.exports = USER