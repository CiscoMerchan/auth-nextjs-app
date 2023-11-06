import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'


export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get('token')?.value || '';
        // Check and verify the response from the token
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        // return the id of the token 
        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
}