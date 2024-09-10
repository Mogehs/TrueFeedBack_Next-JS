import nodemailer from "nodemailer";
import emails from "@/emails/emails";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // set to true if using SSL (port 465)
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmails = async ({ username, email, verifyCode }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Verification Code",
      html: emails({ username, otp: verifyCode }),
    });

    console.log("Message sent: %s", info.messageId);

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (e) {
    console.log("Email not sent: " + e.message);

    return {
      success: false,
      message: "Failed to send email",
    };
  }
};

export default sendEmails;
