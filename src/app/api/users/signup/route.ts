import  { connect }  from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { log } from "console";
import { sendEmail } from "@/helpers/mailer";

connect()

export async function POST(request: NextRequest) {
    try{
        const reqBody = await request.json()
        const {email,username, password } = reqBody
        
        console.log(reqBody);

        // Check if user is already in the DB
        const user = await User.findOne({email})
        if (user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        // hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPasword = await bcryptjs.hash(password, salt);
        
        // New object
        const newUserCreated = new User ({
            email,
            username,
            password : hashedPasword,
        });

        const saveUser = await newUserCreated.save()
        console.log(saveUser);

        
        // Send Verification email

        await sendEmail({email, emailType:'VERIFY',
        userId: saveUser._id})

        return NextResponse.json({
            message: "User created successfully",
            success :true,
            saveUser
        })   
    } catch(error:any) {
        return NextResponse.json({error:error.message}, {status:500})
    }    
}