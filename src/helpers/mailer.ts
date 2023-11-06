import nodemailer from 'nodemailer'; 
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email, emailType, userId}:any) =>{
    try {
        // Create an hashed Token with the user Id
        const hashedToken= await bcryptjs.hash(userId.toString(), 10)

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId,
                {verifyToken: hashedToken,
                verifyTokenExpiry: Date.now()+3600000})
        } else if (emailType === 'REST') {
            await User.findByIdAndUpdate(userId,
                {forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now()+86400000})
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.NODEMAILER_USER,
              pass: process.env.NODEMAILER_PASSWORD
            }
          });
            
        const mailOption = {
            from: 'franciscoeliasm@yahoo.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" :
            "Reset your Password",
            html: `<p>Click <a href="${process.env.DOMAIN}/
            verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY"? "verify your email" :
        "reset your password"}
        or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
        }

        const mailresponse = await transport.sendMail(mailOption);
        return mailresponse;
    } catch (error:any) {
        throw new Error(error.message);
    }
}