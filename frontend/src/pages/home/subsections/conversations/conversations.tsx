import { Friends_list_component } from "../../../../components/friend_list_component/Friend_list_component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import "./conversations.css";
import { getAllUserConversations } from "../../../../services/conversationService";
import { useAuthenticatedQuery } from "../../../../utils/useAuthQuery/useQueryHook";
import { Conversation } from "../../../../components/conversation/conversation";
import { useState } from "react";

export const Conversations = () => {
  const [currentConversation, setCurrentConversation] = useState<string | null>(localStorage.getItem("lastSeenConversation"))
  const { data: conversations } = useAuthenticatedQuery(
    "userConversations",
    async () => await getAllUserConversations(),
    {
      onSuccess: () => {
        if(!currentConversation && conversations!.length > 0) setCurrentConversation(conversations![0].id)
      },
      onError: (res) => console.log(res),
    }
  );

  return (
    <>
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
          {conversations && conversations.length > 0 ? (
            conversations?.map((element) => (
              <Friends_list_component data={element} key={element.id} />
            ))
          ) : (
            <p>Brak konversacji</p>
          )}
        </div>
      </div>
      {currentConversation && <Conversation id={currentConversation} />}
    </>
  );
};
