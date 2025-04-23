// === Node.js backend with Gmail SMTP ===
// Save this as server.js

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

// Replace these with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mshieldsrph@gmail.com', // replace with your Gmail
    pass: 'yxlw wzzl daip qnde'     // generate an app password in Google Account settings
  }
});

app.post('/api/send-email', async (req, res) => {
  const { email, html } = req.body;
  try {
    await transporter.sendMail({
      from: 'Your Toolkit <mshieldsrph@gmail.com>',
      to: email,
      subject: 'Your Patient and Family Engagement Learning and Resources!',
      html: html
    });
    res.json({ message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
