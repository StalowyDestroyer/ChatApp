import apiClient from "../configs/apiClient";

export const getUserById = async (id: number) => {
  const result = await apiClient.get(`user/${id}`);
  return result.data;
};
