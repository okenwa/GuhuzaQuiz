import db from "@/lib/db";

async function fetchLevels() {
    try {
        const levels = await db.level.findMany({ 
            orderBy : { 
                Level_Id : 'desc'
            }
        });
        return levels

    } catch (e) {
        console.error(e)
    }
}

export default fetchLevels