import nodemailer from 'nodemailer';

const sendMail = async (req, res) => {
  try {

    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'rodger.bradtke99@ethereal.email',
        pass: 'p52CpUh1rzKmFqgByq'
      }
    });

    const info = await transporter.sendMail({
      from: '"Smriti👻" <smriti@ethereal.email>',
      to: "smritipiplani@gmail.com",
      subject: "Hello Smriti ✔",
      text: "Hello Smriti \n How are you",
      html: "<b>Hello Smriti<br>How are you</b>"
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({
      message: "Mail sent successfully!",
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl(info) // handy preview
    });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send mail" });
  }
};

export default sendMail;
