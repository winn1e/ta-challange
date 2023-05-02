import { httpClient } from "./http-client";

export const signIn = async (email) => {
  const response = await httpClient.post("/signin", { email });

  return response.data;
};

export const mfa = async (otp, loginSessionId) => {
  const response = await httpClient.post("/signin/mfa", {
    loginSessionId,
    otp,
  });

  return response.data;
};
