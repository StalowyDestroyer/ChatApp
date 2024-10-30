import apiClient from "../configs/apiClient";
import { UserUpdateFormData } from "../types/types";

export const getUserById = async () => {
  const result = await apiClient.get(`user`);
  return result.data;
};

export const updateUserData = async (data: UserUpdateFormData) => {
  const formData = new FormData();
  if (data.file) formData.append("file", data.file);
  formData.append("userData", data.username);

  const result = await apiClient.patch(`user/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result.data;
};
