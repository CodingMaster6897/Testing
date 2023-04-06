const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//* Schema for turf owner

const OwnerSchema = new Schema({
  name: { type: String, required: true },

  phone: { type: Number, required: true, unique: true },

  email: { type: String, required: false },

  password: { type: String, required: true },
  
});

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;
