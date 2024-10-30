import { useState } from "react";
import keks from "../../../../assets/react.svg";
import { useMutation, useQuery } from "react-query";
import { UserUpdateFormData } from "../../../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { getUserById, updateUserData } from "../../../../services/userService";
import { validateUserUpdate } from "../../../../validators/userValidation";

export const Profile_settings = () => {
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

  useQuery("userData", async () => await getUserById(), {
    onSuccess: (res) => {
      setUserData({
        username: res.username,
      });
      setImage(res.profilePicturePath);
    },
    onError: (res) => console.log(res),
  });

  return (
    <>
      <div className="d-flex flex-column align-items-center w-100 overflow-auto new_conversation_contener">
        <form
          className="col-9 col-sm-7 col-md-5 col-xl-4 col-xxl-3 d-flex flex-column gap-3"
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
    </>
  );
};
