"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { playerContext } from "./context/playerContext";
import LoginButton from "./components/buttons/loginBtn";
import LogoutButton from "./components/buttons/logoutBtn";
import { auth } from "@/auth";
import { div } from "framer-motion/client";

export default async function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { AssignPlayerData, player, setPlayerLevel } = useContext(playerContext) as any;
  const [error, setError]= useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch("/api/login", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("User logged in successfully!", data);
            AssignPlayerData(data.player);
            setPlayerLevel(data.player.Level_Id)
            if(data.player.Level_Id == 1){ 
              router.push("/quiz"); 
            } else { 
              router.push("/profile")
            }

            console.log()
            
        } else {
            const errorData = await response.json();
            console.error("Login failed:", errorData.message);
            setError("Log in Failed " +errorData.message )
            
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
        setError("An error occurred during login " + error)
       
    }
  };

  const session = await auth()
  if (session){ 
   const  user = session.user
   return(
    <div className="flex h-full">
    <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
      <form onSubmit={handleLogin} className="">
        <h1 className="title mb-5 w-32">
         Welcome
        </h1>
        <p>Hello, {user?.name} </p>
        <p>You are already loged in, if you want to loginto another account please logout</p>
        <div className="mt-5 w-full">
        <LogoutButton/>
        </div>
        
        

      
      </form>
     
    </div>
  </div>
   )
  }
  return (
    <div className="flex h-full">
      <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
        <form onSubmit={handleLogin} className="">
          <h1 className="title mb-5 w-32">
            Log in
          </h1>
          <p>Hello, Welcome to Guhuza Quiz App , The authentication is handled by Guhuza</p>
          {/* <div className="">
            <div>
              <label className="">Username</label>
              <div>
                <input
                  placeholder="@SudipBhusal"
                  type="text"
                  className="border-2 rounded px-2 py-4 w-96"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="">Password</label>
              <div>
                <input
                  placeholder="Enter Password here "
                  type="password"
                  className="border-2 rounded px-2 py-4 w-96"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <p className="text-red-500">{error} </p>
              </div>
            </div>
          </div> */}

          <div>
            {/* <button className="quizPbtn mt-5 w-full" type="submit">
              Log in
            </button> */}
            <div className="mt-5 w-full">
            <LoginButton/>
            </div>
           
          </div>
        </form>
        {/* <div className="mt-4">
          <p>Don't have an account ?</p>
          <Link href={"/signup"} className="text-blue-600">
            Create New Account
          </Link>
        </div> */}
      </div>
    </div>
  );
}