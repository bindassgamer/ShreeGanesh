const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./server/.env" });

const Ticket = require("../models/Ticket");

const app = express();
app.use(express.json());

const { MONGODB_URI, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI env variable");
  }

  cachedConnection = await mongoose.connect(MONGODB_URI, {
    dbName: "appliancecare"
  });

  return cachedConnection;
}

function createTransporter() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("Missing SMTP configuration in environment variables");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/tickets", async (req, res) => {
  try {
    const { category, address, email, phone, description } = req.body || {};

    if (!category || !address || !email || !phone || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await connectToDatabase();

    const ticket = await Ticket.create({
      category,
      address,
      email,
      phone,
      description
    });

    const transporter = createTransporter();
    await transporter.sendMail({
      from: SMTP_FROM,
      to: email,
      subject: `ApplianceCare Hub - ${category} request received`,
      text: `Thanks for reaching out to ApplianceCare Hub.\n\nCategory: ${category}\nDescription: ${description}\n\nWe will be back to you soon!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2>Thanks for reaching out to ApplianceCare Hub</h2>
          <p>We received your request and will be back to you soon!</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Description:</strong> ${description}</p>
        </div>
      `
    });

    return res.status(201).json({
      message: "Ticket created successfully.",
      ticketId: ticket._id
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

module.exports = app;
