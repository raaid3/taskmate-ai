import { useAuth0 } from "@auth0/auth0-react";
import Button from "@repo/ui/button";
export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();
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
  return (
    <div>
      <h1>Login Page</h1>
      <p>Please log in to access the application.</p>
      <Button onClick={handleLogin}>Log In</Button>
    </div>
  );
}
