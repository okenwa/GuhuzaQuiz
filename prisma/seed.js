const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create 40 levels
  const levels = [];
  for (let i = 0; i <= 40; i++) {
    let levelTitle;
    if (i <= 10) {
      levelTitle = `Beginner Level ${i}`;
    } else if (i <= 20) {
      levelTitle = `Intermediate Level ${i}`;
    } else if (i <= 30) {
      levelTitle = `Advanced Level ${i}`;
    } else {
      levelTitle = `Expert Level ${i}`;
    }

    levels.push(
      prisma.level.create({
        data: {
          Level_Title: levelTitle,
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
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 