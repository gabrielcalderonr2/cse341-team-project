import mongoose from "mongoose";

const ticketClassSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true,
      unique: true,
      enum: ["standard", "premium", "first"],
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerKm: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ticketClass = mongoose.model(
  "TicketClass",
  ticketClassSchema,
  "ticketClasses"
);
export default ticketClass;
