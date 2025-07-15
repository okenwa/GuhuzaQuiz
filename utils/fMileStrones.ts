
import db from "@/lib/db";

async function fetchMilestone() {
    try {
        const milestone = await db.milestone.findMany();
        return milestone

    } catch (e) {
        console.error(e)
    }
}

export default fetchMilestone