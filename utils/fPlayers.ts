
import prisma from "@/lib/prisma"

async function fetchPlayers() {
    try {
        const players = await prisma.player.findMany(
            {include: { 
                milestone : true
            }}
        );
        return players

    } catch (e) {
        console.error(e)
    }
}

export default fetchPlayers