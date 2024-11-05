import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import keks from "../../../../assets/react.svg";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import "./new_conversation.css";
import { useState } from "react";
import { ConversationFormData } from "../../../../types/types";
import { useMutation } from "react-query";
import { createConversation } from "../../../../services/conversationService";
import { useNavigate } from "react-router-dom";
import { validateConversation } from "../../../../validators/conversationValidation";

interface props {
  refetchConversations: () => void;
}

export const New_conversation: React.FC<props> = ({ refetchConversations }) => {
  const [image, setImage] = useState<string | null>(null);
  const [conversationData, setConversationData] =
    useState<ConversationFormData>({ name: "", file: undefined });
  const navigate = useNavigate();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (await validateConversation(conversationData)) await createAsync();
  }
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  function file_change(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file && allowedImageTypes.some((z) => z == file?.type)) {
      setConversationData((prev) => ({
        ...prev,
        file: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const { mutateAsync: createAsync } = useMutation(
    () => createConversation(conversationData),
    {
      onSuccess: () => {
        setConversationData({ name: "", file: undefined });
        setImage(null);
        refetchConversations();
        navigate("/home");
      },
      onError: (error) => console.log(error),
    }
  );

  return (
    <>
      <div className="d-flex flex-column align-items-center w-100 overflow-auto new_conversation_contener">
        <form
          className="col-9 col-sm-7 col-md-5 col-xl-4 col-xxl-3 d-flex flex-column gap-3"
          onSubmit={submit}
          method="POST"
          encType="multipart/form-data"
        >
          <h2 className="new_conversation_title">
            Tworzenie nowej konwersacji
          </h2>
          <div className="position-relative">
            <div className="ratio ratio-1x1">
              <img
                src={image ?? keks}
                className="w-100 bg-white rounded-circle overflow-hidden border border-2 border-black"
              />
            </div>
            <label
              className="position-absolute d-flex image_add"
              htmlFor="conversation_icon"
            >
              <input
                type="file"
                accept="image/*"
                id="conversation_icon"
                className="d-none"
                name="file"
                onChange={file_change}
              />
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="rounded-circle border border-2 bg-black border-black"
              />
            </label>
          </div>
          <div>
            <label className="text-white text-start w-100 p-1">
              Nazwa konwersacji
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Nazwa"
              value={conversationData.name}
              onChange={(e) => {
                setConversationData({
                  ...conversationData,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Utwórz
          </button>
        </form>
      </div>
    </>
  );
};
