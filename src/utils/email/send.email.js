import nodemailer from "nodemailer"


  export const subjectTypes={
    confirmEmail:"Confirm-Email",
    forgetPassword: "forget-password",
    updateEmail:"Update-Email"
  }

export const sendEmail=async({
    to=[],
    cc="",
    bcc="",
    subject="",
    text="",
    html="",
    attachments=[]

})=>{
   
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
   tls: {
    rejectUnauthorized: false, // 👈 يسمح للشهادة
  },
});

// Wrap in an async IIFE so we can use await.

  const info = await transporter.sendMail({
    from: `"Welcome habiby" <${process.env.EMAIL}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments,
   
  });
  console.log("Message sent:", info.messageId);

}