import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./home.css";
import {
  faCirclePlus,
  faComments,
  faGear,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { Routes, Route, Link } from "react-router-dom";
import { Conversations } from "./subsections/conversations/conversations";
import { New_conversation } from "./subsections/new_conversation/new_conversation";
import { Profile_settings } from "./subsections/profile_settings/profile_settings";
import { useMutation } from "react-query";
import { logoutUser } from "../../services/authService";
import { AxiosError } from "axios";
import { ApiMessage } from "../../types/types";
import logo from "../../assets/logo.png";
import { useAuthContext } from "../../utils/authContext/useAuth";
import { useAuthenticatedQuery } from "../../utils/useAuthQuery/useQueryHook";
import {
  checkIfUserIsInChat,
  getAllUserConversations,
} from "../../services/conversationService";
import { useEffect, useState } from "react";

import { useSocket } from "../../utils/socketContext/useSocket";

export const Home = () => {
  const { logout } = useAuthContext();
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );

  const [conversationFilter, setConversationFilter] = useState<string>("");
  const { onEvent } = useSocket();

  useAuthenticatedQuery(
    "isUserInChat",
    async () =>
      await checkIfUserIsInChat(
        localStorage.getItem("lastSeenConversation") ?? ""
      ),
    {
      onSuccess: (res) => {
        setCurrentConversation(
          !res ? null : localStorage.getItem("lastSeenConversation")
        );
        console.log(res);
      },
    }
  );

  const { mutateAsync: logoutAsync } = useMutation(
    async () => await logoutUser(),
    {
      onSuccess: logout,
      onError: (error: AxiosError<ApiMessage>) =>
        console.log(error.response?.data.message),
    }
  );

  const { data: conversations, refetch: conversationRefetch } =
    useAuthenticatedQuery(
      "userConversations",
      async () => await getAllUserConversations(conversationFilter),
      {
        onSuccess: (res) => {
          if (!currentConversation && res!.length > 0)
            setCurrentConversation(res![0].id);
        },
      }
    );

  useEffect(() => {
    conversationRefetch();
  }, [conversationFilter, conversationRefetch]);

  useEffect(() => {
    const event = onEvent("chat-deleted", async () => {
      await conversationRefetch();
      setCurrentConversation(null);
    });
    return event;
  }, [conversationRefetch, onEvent]);

  useEffect(() => {
    const event = onEvent("deleted", async (conversationID: string) => {
      console.log("usunieto");

      if (currentConversation == conversationID) {
        setCurrentConversation(null);
      }
      await conversationRefetch();
    });
    return event;
  }, [onEvent, conversationRefetch, currentConversation]);

  return (
    <div className="home_main_container text-center d-flex flex-column py-3 pe-3">
      <div className="row m-0 h-100">
        <div className="col-2 col-md-1 p-0">
          <div className="w-100 h-100 justify-content-between d-flex flex-column">
            <div>
              {/* app's logo */}
              <img
                src={logo}
                alt="logo"
                className="mt-3 p-1"
                style={{ width: "70px" }}
              />
            </div>
            {/* panel with all the buttons on the left side */}
            <div className="home_buttons_left d-flex gap-5 align-items-center flex-column">
              <div className="d-flex flex-column home_label_FS">
                {/* chat button */}
                <Link to="." className="home_button">
                  <FontAwesomeIcon
                    icon={faComments}
                    className="fs-white home_icon"
                  />
                  <p className="home_label">Rozmowy</p>
                </Link>
              </div>
              <div className="d-flex flex-column home_label_FS">
                {/* work button */}
                <Link to="./profile_settings" className="home_button">
                  <FontAwesomeIcon
                    icon={faGear}
                    className="fs-white home_icon"
                  />
                  <p className="home_label">Konto</p>
                </Link>
              </div>
              <div className="d-flex flex-column home_label_FS">
                {/* meetings button */}
                <Link to="./new_conversation" className="home_button">
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    className="fs-white home_icon"
                  />
                  <p className="home_label">Nowy chat</p>
                </Link>
              </div>
            </div>
            <div className="home_logout d-flex flex-column align-items-center justify-content-center home_label_FS">
              {/* logout button */}
              <button
                className="home_button"
                onClick={async () => {
                  await logoutAsync();
                }}
              >
                <FontAwesomeIcon
                  icon={faPowerOff}
                  className="fs-white home_icon"
                />
                <p className="home_label">Wyloguj się</p>
              </button>
            </div>
          </div>
        </div>
        {/*
                  --------| Middle panel |--------
        */}
        <div className="col-10 col-md-11 p-0 h-100">
          <div className="d-flex home_middle_container p-3">
            <Routes>
              <Route
                path="*"
                element={
                  <Conversations
                    conversationFilter={conversationFilter}
                    setConversationFilter={setConversationFilter}
                    conversations={conversations}
                    currentConversation={currentConversation}
                    setCurrentConversation={setCurrentConversation}
                  />
                }
              />
              <Route path="profile_settings" element={<Profile_settings />} />
              <Route
                path="new_conversation"
                element={
                  <New_conversation
                    refetchConversations={conversationRefetch}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};
