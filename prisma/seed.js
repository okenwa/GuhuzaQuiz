const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create 50 levels with descriptive titles
  const levelTitles = [
    "The First Steps",
    "Basic Understanding",
    "Exploring Concepts",
    "Fundamentals Mastery",
    "Beginning Challenges",
    "Intermediate Insights",
    "Building Knowledge",
    "Progressive Learning",
    "Advanced Foundations",
    "Challenge Mode",
    "Intermediate Proficiency",
    "Expertise Development",
    "Mastering the Basics",
    "Refined Understanding",
    "Conceptual Expansion",
    "Elite Skill Building",
    "Pro-Level Insights",
    "Comprehensive Mastery",
    "Deep Knowledge",
    "Advanced Challenges",
    "Sharpening Expertise",
    "Masterclass Concepts",
    "High-Level Insights",
    "Strategic Thinking",
    "Conceptual Excellence",
    "Deep Diving Challenges",
    "Pro-Level Mastery",
    "Advanced Expertise",
    "Elite Challenges",
    "Skill Refinement",
    "In-Depth Understanding",
    "Advanced Problem Solving",
    "Critical Thinking",
    "Strategic Mastery",
    "Final Countdown",
    "Path to Mastery",
    "Extreme Challenges",
    "Ultimate Insights",
    "Top-Tier Strategies",
    "Proficiency Peak",
    "Final Mastery",
    "Challenge Extreme",
    "Excellence in Practice",
    "Precision Skills",
    "Strategic Genius",
    "Legendary Learning",
    "Supreme Understanding",
    "Ultra Mastery",
    "Top Challenge",
    "The Ultimate Test"
  ];

  const levels = [];
  for (let i = 1; i <= 50; i++) {
    levels.push(
      prisma.level.create({
        data: {
          Level_Title: levelTitles[i - 1],
          Level_number: i
        }
      })
    );
  }
  await Promise.all(levels);

  // Create initial milestones
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        Milestone_Title: "First Quiz",
        Milestone_description: "Complete your first quiz",
        UnlockingLevel: 1,
        Milestone_reward_message: "Congratulations on completing your first quiz!",
        Milestone_Link: "/quiz/1",
        Milestone_Button_CTA: "Start Quiz"
      }
    }),
    prisma.milestone.create({
      data: {
        Milestone_Title: "Quiz Master",
        Milestone_description: "Complete 5 quizzes",
        UnlockingLevel: 2,
        Milestone_reward_message: "You're becoming a quiz master!",
        Milestone_Link: "/quiz/2",
        Milestone_Button_CTA: "Continue Journey"
      }
    })
  ]);

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 