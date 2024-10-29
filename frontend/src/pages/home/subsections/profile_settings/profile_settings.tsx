import { useState } from "react";
import keks from "../../../../assets/react.svg"
import { useMutation } from "react-query";
import { UserUpdateFormData } from "../../../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { updateUserData } from "../../../../services/userService";

export const Profile_settings = () => {
  const [image, setImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserUpdateFormData>({username: "", file: undefined});
  
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await updateAsync();
  }

  function file_change(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const { mutateAsync: updateAsync } = useMutation(
    () => updateUserData(1, userData),//fix user id here
    {
      onSuccess: (res) => {
        //refech danych i zdjęcia
        console.log(res);
      },
      onError: (error) => console.log(error),
    }
  );

  return (
    <>
      <div className="d-flex flex-column align-items-center w-100 overflow-auto new_conversation_contener">
        <form className="col-9 col-sm-7 col-md-5 col-xl-4 col-xxl-3 d-flex flex-column gap-3" onSubmit={submit}>
          <h2 className="new_conversation_title">
            Ustawienia profilu
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
                setUserData({ username: e.target.value });
              }}
              />
          </div>
          <button type="submit" className="btn btn-primary">
            Utwórz
          </button>
        </form>
      </div>
    </>
  )
}
