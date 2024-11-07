import apiClient from "../configs/apiClient";
import { Conversation, ConversationFormData, UserData } from "../types/types";

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

export const getConversationById = async (id: string) => {
  const result = await apiClient.get<Conversation>(`conversation/${id}`);
  return result.data;
};

export const getMessages = async (id: string) => {
  const result = await apiClient.get("conversation/messages/" + id);
  return result.data;
};

export const getUsersInConversation = async (id: string) => {
  const result = await apiClient.get<UserData[]>(`conversation/${id}/members`);
  return result.data;
};

export const getUsersForInvitation = async (id: string, filter: string) => {
  const result = await apiClient.get<UserData[]>(
    `conversation/${id}/canBeInvited?filter=${filter}`
  );
  return result.data;
};

export const inviteToConversation = async (
  conversationId: string,
  invitedId: number
) => {
  const result = await apiClient.post("conversation/invitation", {
    conversationID: conversationId,
    invitedID: invitedId,
  });
  return result;
};
