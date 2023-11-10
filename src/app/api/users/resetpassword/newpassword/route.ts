import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {token, password} = reqBody
        console.log(token, password);
        console.log('request Body:',reqBody);

        // Verify user token
        const user = await User.findOne({verifyToken:token,
        verifyTokenExpiry: {$gt: Date.now()}})
        console.log('user from vemail:',user);    


        if (!user) {
            return NextResponse.json({error: "Invalid token"},
            {status: 400})
        }
        console.log(user);
        
        // hash new password
        const salt = await bcryptjs.genSalt(10)
        const hashedPasword = await bcryptjs.hash(password, salt);

        // Insert in DB new user Password
        user.password = hashedPasword;
        await user.save();
        console.log(password)
        return NextResponse.json({
            message: "Email verified successfully",
            success: true 
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message},
             {status:  500})
    }
}