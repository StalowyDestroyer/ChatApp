import { LoginFormData, UserData, UserFormData } from "../types/types";
import apiClient from "../configs/apiClient";

export const registerUser = async (data: UserFormData): Promise<UserData> => {
  const result = await apiClient.post("auth/register", data);
  return result.data;
};

export const loginUser = async (data: LoginFormData) => {
  const result = await apiClient.post("auth/login", data);
  return result.data;
};

export const logoutUser = async () => {
  await apiClient.post("auth/logout");
};
