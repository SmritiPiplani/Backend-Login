import express from 'express';
import dotenv from 'dotenv';
import sendMail from './email/email.js';
const app = express();
dotenv.config();


app.post('/send', sendMail); // res is passed here correctly




const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));