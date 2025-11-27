import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Utility function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Endpoint to send brochure
app.post('/send-brochure', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // Use 'true' for port 465, 'false' for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Ecofynn" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Ecofynn Brochure',
    html: `
      <h1>Thank you for your interest in Ecofynn!</h1>
      <p>Please find your brochure attached.</p>
      <p>Best regards,</p>
      <p>The Ecofynn Team</p>
    `,
    // attachments: [
    //   {
    //     filename: 'Ecofynn_Brochure.pdf',
    //     path: './brochure.pdf', // Path to your brochure file
    //     contentType: 'application/pdf',
    //   },
    // ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Brochure sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send brochure. Please try again later.' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Ecofynn Backend Server.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
