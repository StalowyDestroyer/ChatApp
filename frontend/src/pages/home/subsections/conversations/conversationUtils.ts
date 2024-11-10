import React from "react";
import { ReciveMessageData } from "../../../../types/types";

// Laduje wiadomosci i ustawai scroll w miejscu gdzie byla ostatnia wiadomosc
export const loadMessagesAndSetScroll = (
  messageContainer: React.MutableRefObject<HTMLDivElement | null>,
  messagesState: [
    ReciveMessageData[],
    React.Dispatch<React.SetStateAction<ReciveMessageData[]>>
  ],
  setCanRefetch: React.Dispatch<React.SetStateAction<boolean>>,
  firstLoadState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
) => {
  const [isFirst, setIsFirst] = firstLoadState;
  const [olderMessages, setMessages] = messagesState;

  if (olderMessages.length == 0) {
    console.log("wszystkie sa");
    setCanRefetch(false);
    return;
  }
  const container = messageContainer.current;
  const scrollHeightBefore = container ? container.scrollHeight : 0;

  setMessages((prev) => [...olderMessages, ...prev]);
  setTimeout(() => {
    if (container && isFirst) {
      const scrollHeightAfter = container.scrollHeight;
      const scrollDelta = scrollHeightAfter - scrollHeightBefore;
      container.scrollTop += scrollDelta;
      setIsFirst(false);
    }
  });
};

//Scroll'uje na koniec komponentu konwersacji (dol)
export const scrollToBottom = (
  messageContainer: React.MutableRefObject<HTMLDivElement | null>
) => {
  setTimeout(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTo({
        behavior: "smooth",
        top: messageContainer.current.scrollHeight,
      });
    }
  });
};

//Zmiana stanu wyszukiwarki do zaproszen
export async function inviteFilterChange(
  e: React.ChangeEvent<HTMLInputElement>,
  setInvitationFilter: React.Dispatch<React.SetStateAction<string>>,
  usersForInvitationRefetch: () => void
) {
  setInvitationFilter(e.target.value);
  setTimeout(async () => {
    if (e.target.value.length > 0) usersForInvitationRefetch();
  });
}

//Przekazywanie Id do parametru funckji pobierajacej wiadomosci
export const setIdForRequest = (messages: ReciveMessageData[]) =>
  messages.length > 0 ? messages[0].message.id : -1;
