import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendCodeEmail } from "@/helpers/sendCodeToUser";


connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email} = reqBody
        console.log(email);
        console.log('request Body:',reqBody);

        const user = await User.findOne({email: email})
        console.log('user from vemail:',user);    


        if (!user) {
            return NextResponse.json({error: "Invalid email"},
            {status: 400})
        }
        console.log(user);
        
        // code generator
        const code: string = (Math.floor(Math.random() * 900000) + 100000).toString();

        // Send data to user by email 
        await sendCodeEmail({email:user.email, code});

        user.forgotPasswordTokent = code;
        user.forgotPasswordTokentExpiry = new Date(Date.now() + 3600000);
        
        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true 
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message},
             {status:  500})
    }
}