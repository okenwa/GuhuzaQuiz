import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { username, firstName, lastName, password, tempScore } = await req.json()
    if (!username || !firstName || !lastName || !password) {
        return NextResponse.json(
            { message: "All fields are required" + username + firstName + lastName + password + tempScore },
            { status: 400 }
        )
    }

    const levelId: number = tempScore == 0 ? 1 : 2
    const hasedPassword = await bcrypt.hash(password, 10)
    try {

        const player = await prisma.player.create({
            data: {
                Player_name: username,
                FirstName: firstName,
                LastName: lastName,
                Password: hasedPassword,
                Playerpoint: tempScore,
                streak: 0,
                lastLogin: new Date(),
                Level_Id: levelId,
                Milestone_Id: 1,
            }
        })

        
        const cookieStore =  cookies()
            cookieStore.set('LoggedIn', 'true', { secure: true , httpOnly:true,sameSite:"strict", path:"/", })
            cookieStore.set('PlayerLevel', String(levelId), { secure: true , httpOnly:true,sameSite:"strict", path:"/", })


        return NextResponse.json({ message: "Player Created Successfully", player: player }, { status: 201 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "Failed to create player" + e, error: e }, { status: 500 })
    }
}