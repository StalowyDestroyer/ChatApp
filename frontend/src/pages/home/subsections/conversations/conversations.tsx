import { Friends_list_component } from "../../../../components/friend_list_component/Friend_list_component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./conversations.css";
import { Conversation as ConversationComponent } from "../../../../components/conversation/conversation";
import { useEffect } from "react";
import { useSocket } from "../../../../utils/socketContext/useSocket";
import { Conversation, SocketMessagePayload } from "../../../../types/types";

interface props {
  conversations: Conversation[] | undefined;
  currentConversation: string | null;
  setCurrentConversation: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Conversations: React.FC<props> = ({
  conversations,
  currentConversation,
  setCurrentConversation,
}) => {
  const { emitEvent, onEvent } = useSocket();

  useEffect(() => {
    const offNotificationEvent = onEvent(
      "notification",
      (data: SocketMessagePayload) => {
        if (data.roomID != currentConversation) alert(data.message.content);
      }
    );

    return () => {
      offNotificationEvent();
    };
  }, [onEvent, currentConversation]);

  useEffect(() => {
    if (currentConversation) {
      emitEvent("join-room", currentConversation);
      console.log("joinRoom " + currentConversation);
    }
  }, [currentConversation, emitEvent]);

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      emitEvent(
        "index-chats",
        conversations.map((z) => z.id)
      );
      console.log("index");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  return (
    <>
      {/* <p className="text-white">{currentConversation}</p> */}
      {/* Left side of the main panel, searchbar and friends */}
      <div className="col-3 col-md-4 home_middle_left_container d-flex flex-column">
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
      {currentConversation && (
        <ConversationComponent id={currentConversation} />
      )}
    </>
  );
};
