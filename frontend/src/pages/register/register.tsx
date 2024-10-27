import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ApiMessage, UserFormData } from "../../types/types";
import { useMutation } from "react-query";
import { validateUserForRegister } from "../../validators/userValidation";
import { AxiosError } from "axios";
import { registerUser } from "../../services/authService";

export const Register = () => {
  const [registerData, setRegisterData] = useState<UserFormData>({
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submitRegisterForm() {
    if (await validateUserForRegister(registerData)) await registerUserAsync();
  }

  const { mutateAsync: registerUserAsync } = useMutation(
    async () => await registerUser(registerData),
    {
      onSuccess: (res) => console.log(res),
      onError: (error: AxiosError<ApiMessage>) =>
        console.log(error.response?.data.message),
    }
  );

  return (
    <div className="d-flex align-items-center justify-content-center main_container text-white">
      <div className="d-flex flex-column form_container col-11 col-sm-8 col-md-5 col-xl-4 col-xxl-3 position-relative rounded p-4">
        <FontAwesomeIcon
          icon={faUser}
          className="login_image position-absolute start-50 translate-middle rounded-circle bg-secondary p-4"
        />
        <h1 className="text-center mt-5 mb-1">Rejestracja</h1>
        <div className="d-flex flex-column gap-3">
          <div>
            <label className="fs-5 p-1">Nazwa użytkownika</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                value={registerData.username}
                name="username"
                className="form-control fs-5"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div>
            <label className="fs-5 p-1">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                name="email"
                value={registerData.email}
                className="form-control fs-5"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div>
            <label className="fs-5 p-1">Hasło</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="password"
                value={registerData.password}
                className="form-control fs-5"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div>
            <label className="fs-5 p-1">Powtórz hasło</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="passwordCheck"
                value={registerData.passwordCheck}
                className="form-control fs-5"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className="d-flex flex-column pt-3">
            <button
              className="btn btn-primary fs-4 rounded-4"
              onClick={() => submitRegisterForm()}
            >
              Zarejestruj się
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
