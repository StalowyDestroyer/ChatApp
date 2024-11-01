import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./conversation.css"
import { faEllipsisVertical, faMagnifyingGlass, faPaperclip } from "@fortawesome/free-solid-svg-icons"
import { Conversation_message_component } from "../conversation_message_component/Conversation_message_component"
import { useState } from "react"
import { useAuthenticatedQuery } from "../../utils/useAuthQuery/useQueryHook"
import { getConversationById } from "../../services/conversationService"

interface props {
  id: string,
}

export const Conversation: React.FC<props> = ({id}) => {
  const [searchString, setSearchString] = useState<string>("");
  const [messageSearchActive, setMessageSearchActive] = useState<boolean>(false);
  
  const {data: conversationInfo } = useAuthenticatedQuery(
    ['conversation', id],
    async () => await getConversationById(id), {
      onSuccess: (res) => {
        console.log(res);
        
      },
      onError: (res) => {
        console.log(res);
        
      }
    }
  )

  return (
      <div className="col-8 home_middle_right_container">
      {/* Header container*/}
      <div className="home_info_header d-flex justify-content-between mx-5">
        {/* Info container */}
        <div className="align-items-start d-flex flex-column">
          <label className="home_label home_chat_name m-0 p-0">{conversationInfo?.name}</label>
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
            <input className={"form-control message_search_input " + (messageSearchActive ? "" : "message_search_input_hidden")}
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}/>
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
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="Lorem ipsum dolor sit amet consectetur adipisicing elit. At tempore harum earum sed, expedita doloremque eveniet consequatur quibusdam, atque similique consequuntur, sunt assumenda accusantium reprehenderit quod eius vitae corrupti autem."/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
        <Conversation_message_component author="friend" message="dsadsadasdsa"/>
        <Conversation_message_component author="user"  message="aaaaaaaaaaaaaaaaaaaaaaaaa"/>
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
  )
}
