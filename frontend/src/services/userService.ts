import { LoginFormData, UserData, UserFormData } from "../types/types";
import apiClient from "../configs/apiClient";

export const registerUser = async (data: UserFormData): Promise<UserData> => {
  const result = await apiClient.post("user/register", data);
  return result.data;
};

export const loginUser = async (data: LoginFormData) => {
  await apiClient.post("user/login", data);
};
