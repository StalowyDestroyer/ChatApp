import { Friends_list_component } from "../../../../components/friend_list_component/Friend_list_component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./conversations.css";
import { getAllUserConversations } from "../../../../services/conversationService";
import { useAuthenticatedQuery } from "../../../../utils/useAuthQuery/useQueryHook";
import { Conversation } from "../../../../components/conversation/conversation";
import { useEffect, useState } from "react";

import { useSocket } from "../../../../utils/socketContext/useSocket";
import { SocketMessagePayload } from "../../../../types/types";

export const Conversations = () => {
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    localStorage.getItem("lastSeenConversation")
  );
  const { emitEvent, onEvent } = useSocket();
  const { data: conversations } = useAuthenticatedQuery(
    "userConversations",
    async () => await getAllUserConversations(),
    {
      onSuccess: (res) => {
        if (!currentConversation && res!.length > 0)
          setCurrentConversation(res![0].id);
      },
      staleTime: 0,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (currentConversation) {
      emitEvent("join-room", currentConversation);
      console.log("joinRoom");
    }

    if (conversations && conversations.length > 0) {
      emitEvent(
        "index-chats",
        conversations.map((z) => z.id)
      );
      console.log("index");
    }

    const offNotificationEvent = onEvent(
      "notification",
      (data: SocketMessagePayload) => {
        alert(data.message.content);
      }
    );

    return () => {
      offNotificationEvent();
    };
  }, [emitEvent, onEvent, currentConversation, conversations]);

  return (
    <>
      {/* <p className="text-white">{currentConversation}</p> */}
      {/* Left side of the main panel, searchbar and friends */}
      <div className="col-4 home_middle_left_container d-flex flex-column">
        <div className="home_searchbar_container">
          <div className="home_searchbar gap-2">
            {/* Searchbar */}
            <button className="conversation_button">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="home_icon" />
            </button>
            <input type="text" placeholder="Search" />
          </div>
          {/* Friends list */}
        </div>
        <div className="home_friend_list gap-2 d-flex flex-column">
          {conversations?.map((element) => (
            <Friends_list_component
              data={element}
              key={element.id}
              setCurrentConversation={setCurrentConversation}
            />
          ))}
        </div>
      </div>
      {currentConversation && <Conversation id={currentConversation} />}
    </>
  );
};
