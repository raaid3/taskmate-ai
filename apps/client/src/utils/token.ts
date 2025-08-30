type TokenProvider = () => Promise<string | undefined>;

let tokenProvider: TokenProvider | undefined;

export function setTokenProvider(provider: TokenProvider) {
  console.debug("Setting token provider for TRPC client...");
  tokenProvider = provider;
}

export async function getToken() {
  if (!tokenProvider) {
    console.debug(
      "Token provider is not set. Please call setTokenProvider first."
    );
    return undefined;
  }
  console.debug("Fetching token using the provided token provider.");
  return await tokenProvider();
}
