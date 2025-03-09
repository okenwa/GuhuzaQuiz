import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
type typeUser = { 
    userid : number, 
    username : string | null , 
    email  : string 

}
 const   fetchUser = async (userid:number, username:string, email :string ) => { 




const playerexist = await prisma.player.findFirst({
    where: {
        Player_ID: userid,
    },
});




if (playerexist) { 
    const player = await prisma.player.update({ 
        where : { 
            Player_ID : userid
        }, data : { 
            Player_name : username, 
            

        }, 
        include: { 
            milestone : true
        }
    })
    
    return player
}else   { 
       
 

    const player = await prisma.player.create ( { 
      data : { 
        Player_ID : Number(userid),
        Player_name : username, 
        Playerpoint: 0, 
        Level_Id : 1,
        Milestone_Id : 1, 
        lastLogin : new Date(), 
        streak : 0 , 
      }
    })
    return player
}


}

export default fetchUser