import apiClient from "../configs/apiClient";
import { Conversation, ConversationFormData } from "../types/types";

export const createConversation = async (data: ConversationFormData) => {
  const formData = new FormData();

  if (data.file) formData.append("file", data.file);
  formData.append("conversation", data.name);

  const result = await apiClient.post("conversation", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result.data;
};

export const getAllUserConversations = async () => {
  const result = await apiClient.get<Conversation[]>(
    "conversation/userConversations"
  );
  return result.data;
};
