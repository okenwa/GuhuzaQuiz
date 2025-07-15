import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {


    try {
        const { playerId,nextMilestone } = await req.json()
        if (!playerId || !nextMilestone ) {
            return NextResponse.json(
                { message: "All field are required" +nextMilestone +playerId },
                { status: 400 }
                
            )
        }

       const updatePlayer = await db.player.update({
        where: { 
            Player_ID: playerId
        }, 
        data : { 
            Milestone_Id: nextMilestone

        }, include: {
            milestone: true

        }
       })
       

        return NextResponse.json({ message: "User Created Sucessfullt", player : updatePlayer, nextMilestone : nextMilestone }, { status: 201 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "Failed to create user" + e, error: e }, { status: 500 })
    }
}