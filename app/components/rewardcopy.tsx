"use client";
import React, { useState, useRef, useContext} from "react";
import Image from "next/image";
import { playerContext } from "../context/playerContext";
import { Resend } from 'resend';
import { useRouter } from "next/navigation";

type typeMilestone = { 
    Milestone_Id : number;
    Milestone_Title : string;
    Milestone_description : string; 
    Milestone_link : string;
}


type typePlayer = {
    Level_Id: number;
    Milestone_Id: number;
    Player_ID: number;
    Player_name: string;
    Playerpoint: number;
    Temp_Score: number;
    lastLogin: Date;
    streak: number;
    user_Id: number;
    milestone : typeMilestone
  };

  type typeRewardCopy =  { 
    player : typePlayer | null
  }


function RewardCopy({player}:typeRewardCopy) {
  const router = useRouter()
  const reward = player?.milestone
  const playerId = player?.Player_ID
  const currentMilestone = player?.milestone?.Milestone_Id ?? 1
  
  const handleSumit = async (e: React.FormEvent) => { 
    e.preventDefault()
   const  nextMilestone = currentMilestone +1
    const response = await fetch("/api/reward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerId,  nextMilestone }),
    });
  
    if (response.ok) { 
      
    
      const data = await response.json()
        
      window.open("https://google.com", "_blank");
      router.push("/profile")
      

    } else {
      console.error("Failed to send email");
    }
  };



  return (
    <div className="container">
      <h1 className="title mt-20">{reward?.Milestone_Title}</h1>
      <p className="mt-6">
      Awesome work! You've completed Level 20! 🚀 Your reward is access to Chapter 1 of Tales from the Recruiter on Spotify. Click below to start listening and enhance your recruitment knowledge! 🎧 [Listen to Chapter 1]
      </p>
      <p className="mt-4">{reward?.Milestone_description}</p>
      <form className="mt-10 mb-20">
        <div>
        <a className="underline text-blue-600 font-medium" href="https://tinyurl.com/mpv2vxnt" target="_blank"> Claim Reward</a>
        </div>
     
        <br></br>
        <button className="quizPbtn mt-8" onClick={handleSumit}>Submit</button>
      </form>
    </div>
  );
}

export default RewardCopy;
