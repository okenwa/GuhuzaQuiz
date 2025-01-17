"use client";
import React from "react";
import { useState } from "react";
import Pbtn from "../components/buttons/pbtn";
import Sbtn from "../components/buttons/sbtn";
import Image from "next/image";
import WhyplaySection from "./whyplaySection";

function QuizHomePage() {
  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-text">
          <h1>Level Up Your Job Search with Guhuza Quiz Game</h1>
          <p>
            A fun and interavive way to sharpen your skill. Complete, learn and
            win as you take your job search to next level
          </p>
          <div className="hero-button">
            <Pbtn />
            <Sbtn />
          </div>
        </div>
        <div>
          <Image
            src={"/heroimage.webp"}
            alt="A person giving interview and smiling :)"
            width={100}
            height={100}
          />
        </div>
        <div></div>
      </div>
      <div className="whyplay">
        <h2>Why Play The Guhuza Quiz Game?</h2>
        <div>
          <WhyplaySection />
        </div>
      </div>
    </div>
  );
}

export default QuizHomePage;
