import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
async function fetchLevels() {
    try {
        const levels = await prisma.level.findMany();
        return levels

    } catch (e) {
        console.error(e)
    }
}

export default fetchLevels