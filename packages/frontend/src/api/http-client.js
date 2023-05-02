import axios from "axios";
import { StorageKeys } from "../constants";

const API_URL = process.env['REACT_APP_API_URL']

export const httpClient = axios.create({
  baseURL: API_URL,
});

httpClient.interceptors.request.use((request) => {
  const authToken = localStorage.getItem(StorageKeys.AuthToken);
  if (authToken) {
    request.headers["Authorization"] = `Bearer ${authToken}`;
  }

  return request;
});

httpClient.interceptors.response.use((response) => {
  if (response.status === 401) {
    localStorage.clear();
  }

  return response;
});
