import { Conversation } from "../../types/types";
import "./Friend_list_component.css";
import reactLogo from "../../assets/react.svg";

interface props {
  data: Conversation;
  setCurrentConversation: React.Dispatch<React.SetStateAction<string | null>>
}

export const Friends_list_component: React.FC<props> = ({
  data,
  setCurrentConversation,
}) => {

  function changeConversation() {
    setCurrentConversation(data.id);
    localStorage.setItem("lastSeenConversation", data.id)
  }

  return (
    <div className="home_friend d-flex align-items-center" onClick={() => changeConversation()}>
      <img src={data.imagePath || reactLogo} className="w-25" />
      <div className="home_friend_details w-50 d-flex align-items-start px-3 flex-column gap-2">
        <h5 className="home_label p-0 m-0">{data.name}</h5>
        <label className="home_label">cos</label>
      </div>
      <div className="home_friend_utilities w-25 d-flex flex-column align-items-end gap-2">
        <label className="home_label">4 min</label>
        <label className="bg-primary home_badge">99+</label>
      </div>
    </div>
  );
};
