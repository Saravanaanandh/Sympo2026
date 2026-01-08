import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*", 
}));

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER_ACCOUNT,
        pass:process.env.PASSWORD,
    }
})
app.use((req, res, next) => {
  console.log("➡️ Incoming request:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Server is alive");
});
app.post("/sendmail", async (req, res) => {
  console.log("📩 /sendmail hit", req.body);

  try {
    const info = await transporter.sendMail({
      from: "saravanawebdev@gmail.com",
      to: req.body.email,
      subject: "Registration successful",
      html: `<h2>Hi ${req.body.name}</h2><p>Welcome to Sympo 2026</p>`,
    });

    console.log("✅ Email sent:", info.response);

    res.status(200).json({
      message: "Registration successful, email sent",
    });
  } catch (error) {
    console.error("❌ Email error:", error);

    res.status(500).json({
      message: "Email sending failed",
      error: error.message,
    });
  }
});

app.listen(PORT,  '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});