import { Friends_list_component } from "../../../../components/friend_list_component/Friend_list_component";
import { Conversation_message_component } from "../../../../components/conversation_message_component/Conversation_message_component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faMagnifyingGlass,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import "./conversations.css";
import { useQuery } from "react-query";
import { getAllUserConversations } from "../../../../services/conversationService";

export const Conversations = () => {
  const { data: conversations } = useQuery(
    "userConversations",
    async () => await getAllUserConversations(),
    {
      onSuccess: (res) => console.log(res),
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
              <Friends_list_component data={element} />
            ))
          ) : (
            <p>Brak konversacji</p>
          )}
        </div>
      </div>
      {/* Right side of the main panel, main chat */}
      <div className="col-8 home_middle_right_container">
        {/* Header container*/}
        <div className="home_info_header d-flex justify-content-between mx-5">
          {/* Info container */}
          <div className="align-items-start d-flex flex-column">
            <label className="home_label home_chat_name m-0 p-0">Work</label>
          </div>
          {/* Button container */}
          <div className="d-flex align-items-center justify-content-end gap-5">
            <div className="d-flex gap-2 home_label home_label_FS">
              {/* chat button */}
              <button className="conversation_button">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="fs-white home_icon"
                />
              </button>
            </div>
            <div className="d-flex gap-2 home_label home_label_FS">
              {/* meetings button */}
              <button className="conversation_button">
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="fs-white home_icon"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="home_conversation ms-3">
          <Conversation_message_component />
          <Conversation_message_component />
          <Conversation_message_component />
          <Conversation_message_component />
          <Conversation_message_component />
          <Conversation_message_component />
          <Conversation_message_component />
          <Conversation_message_component />
        </div>
        <div className="home_conversation_input ms-3">
          <form
            className="message_input d-flex align-items-center w-100"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="file"
              id="home_message_files"
              className="d-none"
            ></input>
            <label
              className="conversation_button mx-3"
              htmlFor="home_message_files"
            >
              <FontAwesomeIcon icon={faPaperclip} className="fs-4 home_icon" />
            </label>
            <input
              type="text"
              className="me-4 w-100"
              placeholder="Your message"
            />
          </form>
        </div>
      </div>
    </>
  );
};
