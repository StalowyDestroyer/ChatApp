import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./conversation.css";
import {
  faCircleXmark,
  faEllipsis,
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
import keks from "../../assets/react.svg"

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
  const [sidePanelOpen, setSidePanelOpen] = useState<boolean>(false);

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
      setMessages((prev) => [...prev, data]);
    });

    return removeListener;
  }, [onEvent, id]);

  if(conversationInfo == null) {
    return (
      <div className="col-8">
        <div className="d-flex h-100 align-items-center justify-content-center">
          <p className="text-white">Nie wybrano żadnej rozmowy</p>
        </div>
      </div>
    );
  }
  return (
    <div className="col-9 col-md-8 home_middle_right_container">
        {/* Header container*/}
      <div className="home_info_header d-flex justify-content-between mx-5">
        {/* Info container */}
        <div className="align-items-start d-flex flex-column">
          <label className="home_label home_chat_name m-0 p-0">
            {conversationInfo?.name}
          </label>
        </div>
        {/* Button container */}
        <div className="d-flex align-items-center justify-content-end gap-4">
          <div className="d-flex home_label home_label_FS">
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
          <div className="d-flex home_label home_label_FS">
            <button className="conversation_button"
              onClick={() => setSidePanelOpen(!sidePanelOpen)}
            >
              <FontAwesomeIcon
                icon={sidePanelOpen ? faCircleXmark : faEllipsis}
                className="fs-white home_icon"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="messages_container row">
        <div className={(sidePanelOpen ? "d-none d-xxl-block col-xxl-6" : "col-12") + " d-block h-100"}>
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
        <div className={(sidePanelOpen ? "col-12 col-xxl-6" : "d-none") + " side_panel h-100 pb-3 pe-3 ps-5 ps-xxl-0"}>
          <div className="rounded h-100 d-flex flex-column align-items-center p-3 gap-2">
            <div className="w-50 rounded-circle">
              <img src={keks} className="w-100"/>
            </div>
            <h1>{conversationInfo.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
