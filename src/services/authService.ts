
import { 
  PublicClientApplication, 
  Configuration, 
  AccountInfo, 
  InteractionRequiredAuthError, 
  AuthenticationResult,
  SilentRequest 
} from "@azure/msal-browser";

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
  system: {
    tokenRenewalOffsetSeconds: 300 // Refresh token 5 minutes before expiry
  }
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

export const setActiveAccount = (account: AccountInfo): void => {
  msalInstance.setActiveAccount(account);
};

// Function to acquire token silently
export const acquireTokenSilent = async (request?: SilentRequest): Promise<string | null> => {
  const account = msalInstance.getActiveAccount();
  
  if (!account) {
    throw new Error("No active account! Sign in first.");
  }
  
  const tokenRequest = request || {
    ...loginRequest,
    account,
  };
  
  try {
    const response: AuthenticationResult = await msalInstance.acquireTokenSilent(tokenRequest);
    return response.accessToken;
  } catch (error) {
    // If silent token acquisition fails, acquire token using popup
    if (error instanceof InteractionRequiredAuthError) {
      try {
        const response = await msalInstance.acquireTokenPopup(tokenRequest);
        return response.accessToken;
      } catch (err) {
        console.error("Error during token acquisition:", err);
      }
    }
    console.error("Error acquiring token silently:", error);
    return null;
  }
};

// Function to set up token refresh
export const setupTokenRefresh = (): void => {
  const account = msalInstance.getActiveAccount();
  if (!account) return;
  
  // Helper function to check if token needs refresh
  const refreshToken = async (): Promise<void> => {
    try {
      await acquireTokenSilent();
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Token refresh failed", error);
    }
  };
  
  // Get token expiry time if available
  msalInstance.getAllAccounts().forEach(account => {
    // Setup periodic token refresh (every 15 minutes)
    const refreshIntervalMs = 15 * 60 * 1000; // 15 minutes
    setInterval(refreshToken, refreshIntervalMs);
    
    // Also refresh token immediately
    refreshToken();
  });
};

export default msalInstance;
