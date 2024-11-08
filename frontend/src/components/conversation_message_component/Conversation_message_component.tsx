import { ReciveMessageData } from "../../types/types";
import { useAuthContext } from "../../utils/authContext/useAuth";
import "./Conversation_message_component.css";
import keks from "../../assets/react.svg";
interface props {
  data: ReciveMessageData;
}

export const Conversation_message_component: React.FC<props> = ({ data }) => {
  const { user } = useAuthContext();

  return (
    <div
      className={
        "home_chat_message_container home_chat_" +
        (user?.id == data.user.id ? "user" : "friend")
      }
    >
      {/* <p className="text-white">
        {data.message.createdAt.toLocaleDateString() +
          " - " +
          data.message.createdAt.toLocaleTimeString()}
      </p> */}
      <div className="home_chat_message_text">
        <p className="home_label m-0 p-0">{data.message.content}</p>
      </div>
      <img src={data.user.profilePicturePath || keks} className="w-25" />
    </div>
  );
};
