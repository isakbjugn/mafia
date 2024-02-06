import nodemailer from "nodemailer";
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
  //const otpEmail = render(OneTimePasswordEmail({ name: user.name, otp: user.password}));

  const options = {
    from: process.env.GMAIL_APP_USER,
    to: user.email,
    subject: 'Engangspassord',
    html: `<html><h1>Hei, ${user.name}!</h1><p>Her er ditt engangspassord: ${user.password}</p><p>Det er viktig at du ikke deler dette passordet med noen.</p></html>`
  };
  await transporter.sendMail(options);
};
