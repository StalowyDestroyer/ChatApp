import { Conversation } from "../../types/types";
import "./Friend_list_component.css";
import reactLogo from "../../assets/conversation.svg";

interface props {
  data: Conversation;
  setCurrentConversation: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Friends_list_component: React.FC<props> = ({
  data,
  setCurrentConversation,
}) => {
  function changeConversation() {
    setCurrentConversation(data.id);
    localStorage.setItem("lastSeenConversation", data.id);
  }

  return (
    <div
      className="home_friend d-flex align-items-center"
      onClick={() => changeConversation()}
    >
      <img src={data.imagePath || reactLogo} className="w-25" />
      <div className="home_friend_details d-flex align-items-start px-3 flex-column gap-2">
        <h5 className="home_label p-0 m-0">{data.name}</h5>
        <label className="home_label">
          {"Członkowie: "}
          {data.conversationMembers
            ?.map((z) => z.user.username)
            .splice(0, 3)
            .join(", ")}
          {data.conversationMembers && data.conversationMembers.length > 3
            ? " i " + (data.conversationMembers.length - 3) + " wiecej"
            : ""}
        </label>
      </div>
    </div>
  );
};
