import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) { 
    try {
        const { username, password } = await req.json(); 

        if (!username || !password) {
            return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
        }
        const hashedPassword = bcrypt.hash(password, 10 )
        // const user = await prisma.user.findFirst({ // Find the user by username
        //     where: {
        //         Username: username,
        //     },
        // });

        // if (!user) {
        //     return NextResponse.json({ message: "Invalid credentials" }, { status: 401 }); // User not found
        // }

        // const passwordMatch = await bcrypt.compare(password, user.Password); // Compare provided password with hashed password

        // if (!passwordMatch) {
        //     return NextResponse.json({ message: "Invalid credentials" }, { status: 401 }); // Password doesn't match
        // }

        // // If username and password are correct, fetch the associated player data
        // const player = await prisma.player.findFirst({
        //     where: {
        //         user_Id: user.User_Id, // Assuming there's a userId field in Player model linking to User
        //     }
        // });

        // if (!player) {
        //     return NextResponse.json({ message: "Player data not found for this user" }, { status: 404 }); // Or handle as needed
        // }

        return NextResponse.json({ message: "Login successful", player: {username:username, password : password} }, { status: 200 }); // Return player data

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "An error occurred during login" }, { status: 500 });
    }
}