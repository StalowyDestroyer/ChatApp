import { UserData, UserFormData } from "../../types";
import apiClient from "../configs/apiClient";

export const registerUser = async (data: UserFormData): Promise<UserData> => {
  const result = await apiClient.post("user/register", data);
  return result.data;
};
