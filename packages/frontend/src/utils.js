import { StorageKeys } from "./constants";

export const isAuthorized = () => {
  return !!localStorage.getItem(StorageKeys.AuthToken);
};
