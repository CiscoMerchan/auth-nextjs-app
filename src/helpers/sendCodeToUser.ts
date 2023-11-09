import nodemailer from 'nodemailer';


export const sendCodeEmail = async ({ email, code }: any) => {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'franciscoeliasm@yahoo.com',
      to: email,
      subject: "Your Verification Code",
      text: `<h1>Your verification code</h1><hr/> is: ${code}`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
