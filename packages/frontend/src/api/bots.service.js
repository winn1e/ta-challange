import { httpClient } from "./http-client";

export const getBots = async () => {
  const response = await httpClient.get("/bots");

  return response.data;
};

export const runBot = async (id) => {
  const response = await httpClient.post(`/bots/${id}/run`);

  return response.data;
};
