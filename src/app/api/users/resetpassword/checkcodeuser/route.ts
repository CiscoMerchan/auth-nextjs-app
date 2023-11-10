import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { code } = reqBody;
    console.log(reqBody);
    console.log("request in route", code);

    // Check if user exists with the provided code
    const user = await User.findOne({ forgotPasswordTokent: code });
    if (!user) {
      console.log("Invalid code");
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // Check if the code has expired
    if (user.forgotPasswordTokentExpiry && user.forgotPasswordTokentExpiry < Date.now()) {

      console.log("Token has expired");
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Code is valid, and the token has not expired,
    //  proceed to generate a new token
    const tokenData = {
      id: user._id,
      username: user.username,
    };

    // Create token that encrypt the `tokenData` with a 60-minute expiry
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h", // 60 minutes
    });

    // Update the user's token and token expiry in the database
    user.isVerified = true;
    user.verifyToken = token;
    user.verifyTokenExpiry = new Date(Date.now() + 3600000); // 60 minutes
    await user.save();

    const response = NextResponse.json({
      message: "Login Successfully",
      success: true,
    });

    // store token in the browser
    response.cookies.set("token", token, {
        httpOnly: true,
      });

    // return response to the browser
    console.log('response from checkcode ', response)
    return response  

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
