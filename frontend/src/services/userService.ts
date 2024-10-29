import apiClient from "../configs/apiClient";
import { UserUpdateFormData } from "../types/types";

export const getUserById = async (id: number) => {
  const result = await apiClient.get(`user/${id}`);
  return result.data;
};

export const updateUserData = async (id: number, data: UserUpdateFormData) => {
  const result = await apiClient.put(`user/${id}`, data);
  return result.data;
}
