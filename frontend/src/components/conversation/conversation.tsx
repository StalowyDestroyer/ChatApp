import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./conversation.css";
import {
  faEllipsisVertical,
  faMagnifyingGlass,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { Conversation_message_component } from "../conversation_message_component/Conversation_message_component";
import { useEffect, useRef, useState } from "react";
import { useAuthenticatedQuery } from "../../utils/useAuthQuery/useQueryHook";
import {
  getConversationById,
  getMessages,
} from "../../services/conversationService";
import { useSocket } from "../../utils/socketContext/useSocket";
import { ReciveMessageData, SocketMessagePayload } from "../../types/types";
import { useAuthContext } from "../../utils/authContext/useAuth";

interface props {
  id: string;
}

export const Conversation: React.FC<props> = ({ id }) => {
  const { emitEvent, onEvent } = useSocket();
  const { user } = useAuthContext();
  const [messageText, setMessageText] = useState("");
  const [searchString, setSearchString] = useState<string>("");
  const [messageSearchActive, setMessageSearchActive] =
    useState<boolean>(false);

  const [messages, setMessages] = useState<ReciveMessageData[]>([]);
  const messageContainer = useRef<HTMLDivElement | null>(null);

  const { data: conversationInfo } = useAuthenticatedQuery(
    ["conversation", id],
    async () => await getConversationById(id)
  );

  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scroll({
        top: messageContainer.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [messages]);

  const { isLoading } = useAuthenticatedQuery(
    ["messages", id],
    async () => await getMessages(id),
    {
      onSuccess: (res) => setMessages(res),
    }
  );

  useEffect(() => {
    const removeListener = onEvent("message", (data: ReciveMessageData) => {
      console.log("getMessage");
      setMessages((prev) => [...prev, data]);
    });

    return removeListener;
  }, [onEvent]);

  return (
    <div className="col-8 home_middle_right_container">
      {/* <p className="text-white">{JSON.stringify(user)}</p> */}
      {/* Header container*/}
      <div className="home_info_header d-flex justify-content-between mx-5">
        {/* Info container */}
        <div className="align-items-start d-flex flex-column">
          <label className="home_label home_chat_name m-0 p-0">
            {conversationInfo?.name}
          </label>
        </div>
        {/* Button container */}
        <div className="d-flex align-items-center justify-content-end gap-5">
          <div className="d-flex gap-2 home_label home_label_FS">
            {/* chat button */}
            <button className="conversation_button">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="fs-white home_icon"
                onClick={() => setMessageSearchActive(!messageSearchActive)}
              />
            </button>
            <input
              className={
                "form-control message_search_input " +
                (messageSearchActive ? "" : "message_search_input_hidden")
              }
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
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
      <div className="home_conversation ms-3" ref={messageContainer}>
        {isLoading ? (
          <p className="text-white">Ładowanie</p>
        ) : (
          messages.map((element) => (
            <Conversation_message_component
              data={element}
              key={element.message.id}
            />
          ))
        )}
      </div>
      <div className="home_conversation_input ms-3">
        <form
          className="message_input d-flex align-items-center w-100"
          onSubmit={(e) => {
            e.preventDefault();
            emitEvent("message", {
              roomID: id,
              userID: user?.id,
              message: {
                content: messageText,
              },
            } as SocketMessagePayload);
            console.log("emitMessage");

            setMessageText("");
          }}
        >
          <input type="file" id="home_message_files" className="d-none"></input>
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
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};
