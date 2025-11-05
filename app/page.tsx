import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function HomePage() {
  const session = await auth();
  
  // If user is logged in, redirect to resume-report
  if (session) {
    redirect("/resume-report");
  }
  
  // If not logged in, redirect to signup
  redirect("/signup");
}

export default HomePage;
