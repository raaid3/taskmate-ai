type TokenProvider = () => Promise<string | undefined>;

let tokenProvider: TokenProvider | undefined;

export function setTokenProvider(provider: TokenProvider) {
  console.log("Setting token provider for TRPC client...");
  tokenProvider = provider;
}

export async function getToken() {
  if (!tokenProvider) {
    console.log(
      "Token provider is not set. Please call setTokenProvider first."
    );
    return undefined;
  }
  console.log("Fetching token using the provided token provider.");
  return await tokenProvider();
}
