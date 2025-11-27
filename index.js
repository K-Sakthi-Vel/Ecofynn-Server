import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path'; // Import the 'path' module

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint for email validation using a third-party API
app.post('/validate-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required for validation.' });
  }

  // --- Placeholder for Third-Party Email Validation API Integration ---
  // In a real application, you would integrate a service like ZeroBounce, Hunter.io, etc.
  // Example using a hypothetical service with axios:
  // try {
  //   const validationApiUrl = `https://api.thirdpartyvalidator.com/v1/validate?email=${email}&api_key=${process.env.EMAIL_VALIDATION_API_KEY}`;
  //   const response = await axios.get(validationApiUrl);
  //   if (response.data.status === 'valid' && response.data.deliverability === 'deliverable') {
  //     return res.status(200).json({ isValid: true, message: 'Email is valid and deliverable.' });
  //   } else {
  //     return res.status(400).json({ isValid: false, message: 'Email is not valid or not deliverable.' });
  //   }
  // } catch (error) {
  //   console.error('Third-party email validation error:', error);
  //   return res.status(500).json({ message: 'Email validation service error.' });
  // }

  // For demonstration, simulating a valid email for any non-empty string for now
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    return res.status(200).json({ isValid: true, message: 'Email format is valid (simulated).' });
  } else {
    return res.status(400).json({ isValid: false, message: 'Invalid email format.' });
  }
});


// Endpoint to send brochure
app.post('/send-brochure', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  // Basic syntactic validation is still good practice even with a third-party service
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
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
    attachments: [
      {
        filename: 'Ecofynn_Brochure.pdf',
        path: path.join(__dirname, 'assets', 'Brochure.pdf'), // Use absolute path for reliability
        contentType: 'application/pdf',
      },
    ],
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
