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
  getUsersForInvitation,
  getUsersInConversation,
  inviteToConversation,
} from "../../services/conversationService";
import { useSocket } from "../../utils/socketContext/useSocket";
import { ReciveMessageData, UserData } from "../../types/types";
import { useAuthContext } from "../../utils/authContext/useAuth";
import keks from "../../assets/react.svg";
import { useMutation, useQuery } from "react-query";
import { useModal } from "../modal/useModal";
import { buildButton } from "../modal/Utils";
import {
  inviteFilterChange,
  loadMessagesAndSetScroll,
  scrollToBottom as scrollBottom,
  setIdForRequest,
} from "../../pages/home/subsections/conversations/conversationUtils";

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
  const [invitationFilter, setInvitationFilter] = useState<string>("");
  const [userToInvite, setUserToInvite] = useState<UserData | undefined>(
    undefined
  );
  const [canRefetchMessages, setCanRefetchMessages] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const modal = useModal();

  //Pobiera dane o konwersacji
  const { data: conversationInfo } = useAuthenticatedQuery(
    ["conversation", id],
    async () => await getConversationById(id)
  );

  //Pobiera użytkowników konwersacji
  const { data: members } = useAuthenticatedQuery(
    ["conversationMembers", id],
    async () => await getUsersInConversation(id)
  );

  //Pobiera wiadomości dla danego chatu
  const { isLoading, refetch } = useQuery(
    ["messages", id],
    async () => await getMessages(id, setIdForRequest(messages)),
    {
      onSuccess: (res) =>
        loadMessagesAndSetScroll(
          messageContainer,
          [res, setMessages],
          setCanRefetchMessages,
          [firstLoad, setFirstLoad]
        ),
    }
  );

  //Wywołuje pobieranie wiadomości jeżeli jesteśmy na górze
  useEffect(() => {
    const container = messageContainer.current;
    if (container) {
      const handleScroll = () => {
        if (container.scrollTop <= 200 && canRefetchMessages) {
          setCanRefetchMessages(false);
          refetch().then((res) => {
            if (res.data && res.data.length > 0) {
              setTimeout(() => {
                setCanRefetchMessages(true);
              }, 1000);
            }
          });
          console.log("fetch");
        }
      };

      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRefetchMessages, refetch, messageContainer.current]);

  //Odpieranie wiadomości z socketów
  useEffect(() => {
    const removeListener = onEvent("message", (data: ReciveMessageData) => {
      setMessages((prev) => [...prev, data]);
      if (data.user.id == user!.id) scrollBottom(messageContainer);
    });

    return removeListener;
  }, [onEvent, id, user]);

  //Filtrowanie użytkowników do zaproszeń
  const { data: usersForInvitation, refetch: usersForInvitationRefetch } =
    useAuthenticatedQuery(
      ["usersForInvitation", id],
      async () => await getUsersForInvitation(id, invitationFilter),
      {
        enabled: false,
      }
    );

  //Zapraszanie użytkownika
  const { mutateAsync: inviteAsync } = useMutation(
    async () => await inviteToConversation(id, userToInvite!.id),
    {
      onSuccess: () => setInvitationFilter(""),
    }
  );

  async function submitInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userToInvite) return;
    modal.openModal({
      title: "Zaproszenie",
      content: `Czy napewno chcesz zaprosic <b>${userToInvite?.username}</b> do konwersacji <b>${conversationInfo?.name}</b>?`,
      buttons: [
        buildButton("btn btn-danger", "Nie"),
        buildButton("btn btn-primary", "Tak", async () => {
          await inviteAsync();
          setUserToInvite(undefined);
        }),
      ],
    });
  }

  if (!conversationInfo) {
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
            <button
              className="conversation_button"
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
        <div
          className={
            (sidePanelOpen ? "d-none d-xxl-block col-xxl-6" : "col-12") +
            " d-block h-100"
          }
        >
          <div className="home_conversation ms-3" ref={messageContainer}>
            {isLoading ? (
              <p className="text-white">Ładowanie</p>
            ) : messages.length == 0 ? (
              <p className="text-white">Brak wiadomości</p>
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
                });

                setMessageText("");
              }}
            >
              <input type="file" id="home_message_files" className="d-none" />
              <label
                className="conversation_button mx-3"
                htmlFor="home_message_files"
              >
                <FontAwesomeIcon
                  icon={faPaperclip}
                  className="fs-4 home_icon"
                />
              </label>
              <input
                type="text"
                className="me-4 w-100 text-white"
                placeholder="Your message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div
          className={
            (sidePanelOpen ? "col-12 col-xxl-6" : "d-none") +
            " side_panel h-100 pb-3 pe-3 ps-5 ps-xxl-0"
          }
        >
          <div className="rounded h-100 d-flex flex-column align-items-center p-3 gap-2 overflow-auto">
            <div className="w-50 rounded-circle">
              <img src={keks} className="w-100" />
            </div>
            <h1>{conversationInfo.name}</h1>
            <hr />
            <h4 className="mb-4">Członkowie</h4>
            <div className="w-100">
              <div className="members w-100 overflow-auto">
                {members?.map((member) => (
                  <div className="memberElement" key={member.id}>
                    <img
                      src={member.profilePicturePath || keks}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div className="memberInfo">
                      <h5>{member?.username}</h5>
                      <h6>{member?.email}</h6>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <h4 className="m-0">Dodaj osoby</h4>
            <div className="new_member w-100 p-4">
              <form
                className="w-100 d-flex flex-column align-items-end invitation_form"
                onSubmit={(e) => submitInvite(e)}
              >
                <div className="rounded bg-light overflow-hidden w-100">
                  {!userToInvite ? (
                    <input
                      type="text"
                      className="w-100 form-control border-secondary"
                      onChange={(e) =>
                        inviteFilterChange(
                          e,
                          setInvitationFilter,
                          usersForInvitationRefetch
                        )
                      }
                      value={invitationFilter}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center border border-secondary rounded position-relative gap-2"
                      key={userToInvite.id}
                    >
                      <img
                        src={userToInvite.profilePicturePath || keks}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          backgroundColor: "gray",
                        }}
                      />
                      <div>
                        <p className="p-0 m-0">{userToInvite.username}</p>
                        <label>{userToInvite.email}</label>
                      </div>
                      <button
                        className="member_to_invite_cancel position-absolute"
                        onClick={() => setUserToInvite(undefined)}
                      >
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="fs-white home_icon"
                        />
                      </button>
                    </div>
                  )}
                  <div
                    className={
                      "new_member_container" +
                      (usersForInvitation &&
                      usersForInvitation?.length > 0 &&
                      invitationFilter.length > 0 &&
                      !userToInvite
                        ? " m-2"
                        : "")
                    }
                  >
                    {!userToInvite &&
                      invitationFilter.length > 0 &&
                      usersForInvitation?.map((user) => (
                        <button
                          type="button"
                          key={user.id}
                          className="new_member_selector rounded"
                          onClick={() => setUserToInvite(user)}
                        >
                          <p className="p-0 m-0">{user.username}</p>
                          <label>{user.email}</label>
                        </button>
                      ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary m-2">
                  Potwierdź
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
