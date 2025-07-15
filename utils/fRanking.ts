import db from "@/lib/db";
type fetchRankType = { 
   
    playerpoint : number
}


const fetchRank = async( playerpoint: number)=> { 
const rank = await db.player.count({ 
where : { 
    Playerpoint : { gt:playerpoint}
}

}) +1
return rank


}
export default fetchRank