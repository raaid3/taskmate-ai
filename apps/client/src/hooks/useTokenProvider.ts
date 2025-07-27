import { useLayoutEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setTokenProvider } from "../utils/token";

export function useTokenProvider() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  useLayoutEffect(() => {
    if (isLoading) {
      console.log("Auth0 is loading, not setting token provider yet.");
      return;
    }

    setTokenProvider(async () => {
      if (!isAuthenticated) {
        console.log("User is not authenticated, cannot get token.");
        return undefined;
      }
      try {
        console.log("Getting token silently...");
        return await getAccessTokenSilently();
      } catch (error) {
        console.error("Failed to get access token", error);
        return undefined;
      }
    });
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);
}
