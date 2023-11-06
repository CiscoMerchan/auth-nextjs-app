import  { connect }  from "../../../../dbConfig/dbConfig";
import  User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email , password} =reqBody;
        console.log( reqBody )
        console.log("request in route")
        // from the object of the login page if match the
        // email and the password, redirect the user to profile page with 
        // their user name
        
        // Check if user exist
        const user = await User.findOne({email})
        if(!user){
            console.log("user no found")
            return NextResponse.json({error:"User does not exist"},
            {status:400})
        }
        console.log("user found", user)
        // Check the password
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Password is not valid"}, {status:400})
        }
        // Create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        // create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!,
            {expiresIn: '1d'}
            )
            // Cookies to send on the user page 
        const response = NextResponse.json({
            message: "Login Successfuly",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (error:any) {
        return NextResponse.json({error: error.message},
            {status:500})
    }
}