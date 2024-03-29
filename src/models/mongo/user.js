/**
 * Schema for User entities with basic personal and authentication information.
 *
 * @module User
 * @author Peter Fortune
 * @date 04/03/2024
 */

import Mongoose from "mongoose";
import Boom from "@hapi/boom";

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  permission: String
});

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

userSchema.methods.comparePassword = function (candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw Boom.unauthorized("Password mismatch");
  }
  return this;
};

export const User = Mongoose.model("User", userSchema);
