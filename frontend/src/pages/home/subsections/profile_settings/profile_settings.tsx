import { useState } from "react";
import keks from "../../../../assets/react.svg";
import { useMutation, useQuery } from "react-query";
import { UserUpdateFormData } from "../../../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCirclePlus,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  getLoggedUser,
  updateUserData,
} from "../../../../services/userService";
import { validateUserUpdate } from "../../../../validators/userValidation";
import { useAuthenticatedQuery } from "../../../../utils/useAuthQuery/useQueryHook";
import {
  answearInvitation,
  getInvitationsForUser,
} from "../../../../services/conversationService";
import { queryClient } from "../../../../configs/queryClient";
import { useModal } from "../../../../components/modal/useModal";
import { buildButton } from "../../../../components/modal/Utils";

export const Profile_settings = () => {
  const modal = useModal();
  const [image, setImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserUpdateFormData>({
    username: "",
    file: undefined,
  });

  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (await validateUserUpdate(userData)) await updateAsync();
  }

  function file_change(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && allowedImageTypes.some((z) => z == file.type)) {
      setUserData({ ...userData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const { mutateAsync: updateAsync } = useMutation(
    async () => await updateUserData(userData)
  );

  useQuery("userData", async () => await getLoggedUser(), {
    onSuccess: (res) => {
      setUserData({
        username: res.username,
      });
      setImage(res.profilePicturePath);
    },
    onError: (res) => console.log(res),
  });

  const { data: invitations, refetch: refetchInvitations } =
    useAuthenticatedQuery(
      "invitations",
      async () => await getInvitationsForUser()
    );

  const { mutateAsync: acceptInvitation } = useMutation(
    async (id: number) => await answearInvitation(id, true),
    {
      onSuccess: (res) => {
        console.log(res.status);
        queryClient.invalidateQueries("userConversations");
        refetchInvitations();
      },
    }
  );

  const { mutateAsync: rejectInvitation } = useMutation(
    async (id: number) => await answearInvitation(id, false),
    {
      onSuccess: (res) => {
        console.log(res.status);
        queryClient.invalidateQueries("userConversations");
        refetchInvitations();
      },
    }
  );

  return (
    <>
      <div className="row w-100 overflow-auto new_conversation_contener">
        <div className="col-12 col-md-6 d-flex flex-column align-items-center">
          <form
            className="col-9 col-sm-7 col-md-9 col-xl-7 col-xxl-5 d-flex flex-column gap-3"
            onSubmit={submit}
          >
            <h2 className="new_conversation_title">Ustawienia profilu</h2>
            <div className="position-relative">
              <div className="ratio ratio-1x1">
                <img
                  src={image || keks}
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
                Nazwa użytkownika
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nazwa"
                value={userData.username}
                onChange={(e) => {
                  setUserData({ ...userData, username: e.target.value });
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Zaktualizuj dane
            </button>
          </form>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column align-items-center">
          <div className="d-flex flex-column gap-3 w-100">
            <h2 className="new_conversation_title">Zaproszenia</h2>
            <div className="invitations_container d-flex flex-column p-3 w-100">
              {invitations?.map((invitation) => (
                <div
                  className="invitation bg-secondary rounded w-100 d-flex align-items-center p-3"
                  key={invitation.id}
                >
                  <p className="text-white m-0 flex-grow-1 text-start">
                    Użytkownik <b>{invitation.inviter.username}</b> zaprosił Cię
                    do kowersacji o nazwie <b>{invitation.conversation.name}</b>
                  </p>
                  <button
                    type="button"
                    className="conversation_button"
                    onClick={() =>
                      modal.openModal({
                        title: "Akceptacja zaproszenia",
                        content: `Czy napewno chcesz dolaczyc do konwersacji <b>${invitation.conversation.name}</b>?`,
                        buttons: [
                          buildButton("btn btn-danger", "Nie"),
                          buildButton("btn btn-primary", "Tak", async () =>
                            await acceptInvitation(invitation.id)
                          ),
                        ],
                      })
                    }
                  >
                    <FontAwesomeIcon className="fs-3" icon={faCircleCheck} />
                  </button>
                  <button
                    type="button"
                    className="conversation_button"
                    onClick={() =>
                      modal.openModal({
                        title: "Odrzucenie zaproszenia",
                        content: `Czy napewno chcesz odrzucic zaproszenie do konwersacji <b>${invitation.conversation.name}</b>?`,
                        buttons: [
                          buildButton("btn btn-danger", "Nie"),
                          buildButton("btn btn-primary", "Tak", async () =>
                            rejectInvitation(invitation.id)
                          ),
                        ],
                      })
                    }
                  >
                    <FontAwesomeIcon className="fs-3" icon={faCircleXmark} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
