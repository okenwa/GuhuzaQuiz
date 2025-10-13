import { auth } from "@/auth";
import LoginButton from "./components/buttons/loginBtn";
import LogoutButton from "./components/buttons/logoutBtn";

async function LoginPage() {
  const session = await auth();
  if (session) {
    const user = session.user;
    const name = user?.firstName == null  ? "Anonymous" : user?.firstName
    return (
      <div className="flex h-full">
        <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
          <div className="">
            <h1 className="title mb-5 w-32">Welcome</h1>
            <p>Hello, {name} </p>
            <p className="mb-4">
              You are already logged in! Explore your personalized dashboard and career tools.
            </p>
            
            <div className="space-y-3 mb-6">
              <a 
                href="/profile" 
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Go to Profile & Quiz
              </a>
            
              <a 
                href="/resume-report" 
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Analyze Resume 📄
              </a>
            </div>
            
            <div className="mt-5 w-full">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full">
      <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
        <div className="">
          <h1 className="title mb-5 w-32">Log in</h1>
          <p>
            Hello, Welcome to Guhuza’s Brain Boost , The authentication is handled by
            Guhuza
          </p>

          <div>
            <div className="mt-5 w-full">
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
