import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER_ACCOUNT,
        pass:process.env.PASSWORD,
    }
})

app.post('/sendmail', async (req, res) => {
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});