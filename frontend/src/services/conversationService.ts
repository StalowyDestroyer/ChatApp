import apiClient from "../configs/apiClient";
import {
  Conversation,
  ConversationFormData,
  Invitation,
  ReciveMessageData,
  UserData,
} from "../types/types";

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

export const getMessages = async (id: string, lastID: number) => {
  const result = await apiClient.get(
    "conversation/messages/" + id + "/" + lastID
  );
  return result.data as ReciveMessageData[];
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

export const getInvitationsForUser = async () => {
  const result = await apiClient.get<Invitation[]>(`user/invitations`);
  return result.data;
};

export const answearInvitation = async (id: number, positive: boolean) => {
  const result = await apiClient.post("/conversation/invitationAnswer", {
    id,
    positive,
  });
  return result;
};

export const checkIfUserIsInChat = async (id: string) => {
  const result = await apiClient.get(
    "/conversation/isUserInConversation/" + id
  );
  return result.data;
};

export const downloadFile = async (id: number, name: string) => {
  const response = await apiClient.get(
    "/conversation/messageFile/" + id, {
      responseType: "blob"
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const deleteConversation = async (id: string) => {
  const result = await apiClient.delete("/conversation/" + id);
  return result.data;
}

export const removeUserFromConversation = async (conversationID: string, userID: number) => {
  const result = await apiClient.delete("/conversation/" + conversationID + "/members?userID=" + userID);
  return result.data;
} 