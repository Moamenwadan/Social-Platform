import nodemailer from "nodemailer";
// import { register } from "../modules/Auth/auth.servic.js";
const sendEmail = async ({ to, subject, html }) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: "wadanmoamen@gmail.com",
    //     pass: "mxsw cfav aslq uglu",
    //   },
    // });
    // // console.log(transporter);
    // const info = await transporter.sendMail({
    //   from: "wadanmoamen@gmail.com",
    //   to: "moamenpaploo@gmail.com",
    //   subject: "Hi from nodemailer",
    //   text: "test text from nodemailer",
    //   html: "<h1> Hi from test html </h1>",
    // });
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const info = await transporter.sendMail({
      from: `Moamen <${process.env.EMAIL}>`, // sender address
      to: to, // list of receivers
      subject: subjects, // Subject line
      text: "Hello world?", // plain text body
      html, // html body
    });
    // console.log(info);
    if (info.rejected.length == 0) return true;
    return false;
  } catch (error) {
    console.log(error);
  }
};
// sendEmail();
export const subjects = {
  register: "Account activated",
};
export default sendEmail;
