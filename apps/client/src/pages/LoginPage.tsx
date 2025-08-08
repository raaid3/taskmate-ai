import Iridescence from "@repo/ui/backgrounds/Iridescence";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";
import Button from "../components/Button.tsx";
// import { useEffect, useLayoutEffect } from "react";
export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  // const navigate = useNavigate();

  // useLayoutEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/todos");
  //   }
  // }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: {
          returnTo: "/todos",
        },
      });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }
  return (
    <div className="relative w-screen h-screen bg-black">
      <div className="absolute inset-0">
        <Iridescence
          color={[0.8, 0.7, 1.0]}
          speed={0.5}
          amplitude={0.1}
          mouseReact={true}
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-gray-900/90 backdrop-blur-md p-8 rounded-lg shadow-lg text-center text-white">
          <h1 className="text-5xl font-bold mb-2">Taskmate AI</h1>
          <p className="text-lg text-gray-200 mb-6">
            Your intelligent rescheduling assistant.
          </p>
          <div className="w-full border-t border-white/20 my-6"></div>
          <p className="mb-8 text-gray-300 max-w-sm mx-auto">
            Effortlessly manage your schedule. Let Taskmate AI reschedule
            appointments and create new calendars for you using natural
            language.
          </p>
          <Button onClick={handleLogin}>
            {!isAuthenticated && "Log In or Sign Up to "}Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
