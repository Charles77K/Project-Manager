// utils/sendEmail.ts
import nodemailer from "nodemailer";

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  text: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP details directly
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
