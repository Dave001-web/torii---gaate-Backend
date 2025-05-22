const nodemailer = require("nodemailer")

const {createWelcomeTemplate, createResetTemplate} = require("./emailTemplate")

const sendMail =  async ({to, subject, html })=> {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSOWRD
        }
    })

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to:to,
            subject: subject,
            html: html,
        })
        console.log(`email send ${info.response}`)
    } catch (error) {
        console.log(error)
    }
}

const sendWelcomeEmail = ({fullName, clientUrl, email})=>{
    const subject = "Welcome to Torii Gate"
    const html =  createWelcomeTemplate(fullName, clientUrl)

    sendMail({ to: email, subject, html })
}
const sendResetEmail = ({ fullName, clientUrl, email }) => {
  const subject = "Password Reset";
  const html = createResetTemplate(fullName, clientUrl);

  sendMail({ to: email, subject, html });
};
module.exports = { sendWelcomeEmail, sendResetEmail }