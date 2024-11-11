import { ReciveMessageData } from "../../types/types";
import { useAuthContext } from "../../utils/authContext/useAuth";
import "./Conversation_message_component.css";
import keks from "../../assets/default_user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import { downloadFile } from "../../services/conversationService";

interface props {
  data: ReciveMessageData;
}

interface fileDownloadProps {
  id: number;
  name: string;
}

export const Conversation_message_component: React.FC<props> = ({ data }) => {
  const { user } = useAuthContext();

  const { mutateAsync: downloadFileCilck } = useMutation(
    async (props: fileDownloadProps) => await downloadFile(props.id, props.name)
  );

  return (
    <>
      <div
        className={
          "home_chat_message_container home_chat_" +
          (user?.id == data.user.id ? "user" : "friend")
        }
      >
        <div className={"d-flex flex-column gap-2 home_chat_message_" +
          (user?.id == data.user.id ? "user" : "friend")}>
          {data.message.messageFiles.length > 0 && 
          <div className="d-flex flex-column gap-2">
            {data.message.messageFiles.map(file =>
            file.type.startsWith("image/") ?
            <img src={file.path} className="message_image rounded" key={file.id}/> :
            <div key={file.id} className="d-flex gap-2 other_file align-items-center" onClick={() => downloadFileCilck({id: file.id, name: file.orginalName})}>
              <FontAwesomeIcon className="fs-3 text-white" icon={faFileLines} />
              <p className="p-0 m-0 home_label">{file.orginalName}</p>
            </div>)}
          </div>}
          {data.message.content.length > 0 &&
          <div className="home_chat_message_text">
            <p className="home_label m-0 p-0">{data.message.content}</p>
          </div>}
        </div>
        <img src={data.user.profilePicturePath || keks} />
      </div>
    </>
  );
};
