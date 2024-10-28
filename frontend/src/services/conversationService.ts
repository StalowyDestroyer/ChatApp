import apiClient from "../configs/apiClient";
import { ConversationFormData } from "../types/types";

export const createConversation = async (data: ConversationFormData) => {
  const result = await apiClient.post("conversation", data);
  return result.data;
};
