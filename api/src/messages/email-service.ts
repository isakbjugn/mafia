import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { OneTimePasswordEmail } from "./one-time-password-email.tsx";
import type { User } from "@prisma/client";

const config = {
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
};

const transporter = nodemailer.createTransport(config);

export const sendOtpEmail = async (user: User) => {
  const otpEmail = render(OneTimePasswordEmail({ name: user.name, otp: user.password}));
  const options = {
    from: process.env.GMAIL_APP_USER,
    to: user.email,
    subject: 'Engangspassord',
    html: otpEmail,
  };
  await transporter.sendMail(options);
};
