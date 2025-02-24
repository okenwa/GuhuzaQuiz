// pages/index.tsx
"use client"
import React, { useState } from "react";
import Popup from "@/components/popUp";

const HomePage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl mb-6">Welcome to My Website</h1>
      <button
        className="px-4 py-2 bg-blue-500 quizPbtn text-white rounded-md"
        onClick={openPopup}
      >
Share Points      </button>

      {/* Popup component */}
      <Popup isOpen={isPopupOpen} closePopup={closePopup} points={100} />
    </div>
  );
};

export default HomePage;
