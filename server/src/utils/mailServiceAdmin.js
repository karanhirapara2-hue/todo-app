import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();



export const sendMail = async ({ to, subject, html },{email,password}) => {
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});
  const info = await transporter.sendMail({
    from: `"Terra Focus" <${email}>`,
    to,
    subject,
    html,
  });
  console.log("Email sent:", info.messageId);
  return info;
};