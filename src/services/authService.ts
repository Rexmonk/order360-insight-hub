
import { PublicClientApplication, Configuration, AccountInfo, InteractionRequiredAuthError, AuthenticationResult } from "@azure/msal-browser";

// MSAL configuration
const msalConfig: Configuration = {
  auth: {
    // This should be configured with actual client ID in a real application
    clientId: "your-client-id",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Authentication request scopes
const loginRequest = {
  scopes: ["User.Read"],
};

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Handle redirect promise
msalInstance.handleRedirectPromise().catch((error) => {
  console.error("Redirect error:", error);
});

export const login = async (): Promise<void> => {
  try {
    await msalInstance.loginPopup(loginRequest);
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const logout = (): void => {
  msalInstance.logout();
};

export const getActiveAccount = (): AccountInfo | null => {
  return msalInstance.getActiveAccount();
};

export const acquireToken = async (): Promise<string | null> => {
  const account = msalInstance.getActiveAccount();
  
  if (!account) {
    throw new Error("No active account! Sign in first.");
  }
  
  const request = {
    ...loginRequest,
    account,
  };
  
  try {
    const response: AuthenticationResult = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    // If silent token acquisition fails, acquire token using popup
    if (error instanceof InteractionRequiredAuthError) {
      try {
        const response = await msalInstance.acquireTokenPopup(request);
        return response.accessToken;
      } catch (err) {
        console.error("Error during token acquisition:", err);
      }
    }
    console.error("Error acquiring token silently:", error);
    return null;
  }
};

export default msalInstance;
