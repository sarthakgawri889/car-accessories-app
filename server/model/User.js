import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  given_name: {
    type: String,
  },
  family_name: {
    type: String,
  },
  nickname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  sub: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  email_verified: {
    type: Boolean,
  },
  picture: {
    type: String,
  },
  locale: {
    type: String,
  },
});

const User = mongoose.model("user", userSchema);

export default User;