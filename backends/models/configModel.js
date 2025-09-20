import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., "TAX_RATE"
  value: { type: Number, required: true }             // e.g., 18
});

export default mongoose.model("Config", configSchema);
