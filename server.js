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
app.post('/sendmail', async (req, res) => {
    console.log("📩 /sendmail hit", req.body);
    const { email,name } = req.body;  
    try{
        const mailOptions = {
            from:'saravanawebdev@gmail.com',
            to:email,
            subject:"Registration succuessful",
            html:`<div><h1>Hi ${name},</h1><p>welcome to Sympo 2026</p></div>`, 
        }
        await transporter.sendMail(mailOptions) 
        res.status(200).json({message:"Registration successful, email sent"})
    }catch(error){
        res.status(500).json({message:"Registration failed, email not sent"})
    }

});
app.listen(PORT,  '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});