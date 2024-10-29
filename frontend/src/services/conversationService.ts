import apiClient from "../configs/apiClient";
import { Conversation, ConversationFormData } from "../types/types";

export const createConversation = async (data: ConversationFormData) => {
  const result = await apiClient.post("conversation", data);
  return result.data;
};

export const getAllUserConversations = async () => {
  const result = await apiClient.get<Conversation[]>(
    "conversation/userConversations"
  );
  return result.data;
};
