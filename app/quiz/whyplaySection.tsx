import React from "react";
import Image from "next/image";

function WhyplaySection() {
  const content = [
    {
      image: "/WhyGraphics/LightBulb.svg",
      title: "Job Search Preparation",
      description:
        "Sharpen your job-hunting skills at your own pace with fun, interactive quizzes designed to boost your confidence and knowledge.",
    },
    {
      image: "/WhyGraphics/Trophy.svg",
      title: "Engaging Features",
      description:
        "From leaderboards to rewards for achievements, the Guhuza Quiz Game keeps you motivated and engaged as you level up your job search.",
    },
    {
      image: "/WhyGraphics/LightBulb.svg",
      title: "Trusted Content",
      description:
        "Powered by expert-curated questions, our game covers essential job search topics, ensuring you're prepared for every step of the hiring process.",
    },
  ];
  return (
    <div>
      {content.map((reason) => {
        return (
          <div>
            <Image
              src={reason.image}
              alt={reason.title + "image"}
              width={100}
              height={100}
            />
            <h4>{reason.title}</h4>
            <p>{reason.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default WhyplaySection;
