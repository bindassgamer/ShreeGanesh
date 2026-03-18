const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Laptop", "Desktop", "Printer"],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
