"use client";
import React from "react";
import { useState } from "react";
import Pbtn from "../components/buttons/primarybtn";
import Sharebtn from "../components/buttons/sharebtn";
import Image from "next/image";
import WhyplaySection from "./whyplaySection";
import QuizLevelSections from "../components/quizLevelSections";

function QuizHomePage() {
  return (
    <div className="mt-10 ">
      <div className=" container hero-section flex flex-col md:flex-row items-center bg-white py-16 mt-10 ">
        {/* Text Section */}
        <div className="hero-text md:w-1/2 space-y-6">
          <h1 className="text-7xl font-bold text-gray-800">
            Level Up Your Job Search with Guhuza Quiz Game
          </h1>

          <p className="text-gray-600 text-lg ">
            A fun and interactive way to sharpen your skills, earn rewards, and
            stand out in your career journey. Compete, learn, and win as you
            take your job search to the next level!
          </p>
          <div className="hero-button flex space-x-4">
            <Pbtn message="Start Quiz" toDestination="/1" theme="dark" />
          </div>
        </div>

        {/* Image Section */}
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
          <Image
            src="/heroimage.webp"
            alt="A person giving an interview and smiling"
            className="rounded-md shadow-lg max-w-full h-auto"
            width={500}
            height={300}
          />
        </div>
      </div>

      <div className="whyplay ">
        <WhyplaySection />
      </div>
      <div className="QuizSection mt-16">
        <QuizLevelSections currentLevel={3} />
      </div>
    </div>
  );
}

export default QuizHomePage;
