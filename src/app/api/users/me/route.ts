import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        // Get the token id
        const userId = await getDataFromToken(request);
        // Query to the DB to check the id user
        const user = await User.findOne({_id: userId}).select('-password');
        // Data to no retrive from the DB (negative signe before the name = -password)
        
        return NextResponse.json({
            message: 'User found',
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message},
            {status:400});
    }
}
