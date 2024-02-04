import { createTransport } from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const createTransportOptions = {
  service: process.env.NODEMAILER_SERVICE,
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secureConnection: false,
  tls: {
    ciphers: 'SSLv3',
  },
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
}

export const sendEmail = async ({ email, verificationToken }) => {
  const transporter = createTransport(createTransportOptions)
  return await transporter
    .sendMail({
      from: process.env.NODEMAILER_FROM_MAIL,
      to: email,
      subject: 'Verification Link',
      text: `Mail with verification link`,
      html: `<strong>Hello!</strong><br /> <p>Click on the link below to verify your account</p> Your email verification link is: https://127.0.0.1:3000/users/verify/${verificationToken}`,
    })
    .then((info) => {
      console.log(info)
      return true
    })
    .catch((err) => {
      console.log(err)
      return false
    })
}