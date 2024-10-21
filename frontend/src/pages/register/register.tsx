import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const Register = () => {
  const [registerData, setRegisterData] = useState<object>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="d-flex align-items-center justify-content-center main_container text-white">
      <div className="d-flex flex-column form_container col-11 col-sm-8 col-md-5 col-xl-4 col-xxl-3 position-relative rounded p-4">
        <FontAwesomeIcon icon={faUser} className="login_image position-absolute start-50 translate-middle rounded-circle bg-secondary p-4"/>
        <h1 className="text-center mt-5 mb-1">Rejestracja</h1>
        <div className="d-flex flex-column gap-3">
          <div>
            <label className="fs-5 p-1">Imię</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
              <input type="email" value={registerData.name} className="form-control fs-5" onChange={(e) => handleChange(e)}/>
            </div>
          </div>
          <div>
            <label className="fs-5 p-1">Nazwisko</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
              <input type="email" value={registerData.surname} className="form-control fs-5" onChange={(e) => handleChange(e)}/>
            </div>
          </div>
          <div>
            <label className="fs-5 p-1">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
              <input type="email" value={registerData.email} className="form-control fs-5" onChange={(e) => handleChange(e)}/>
            </div>
          </div>
          <div>
            <label className="fs-5 p-1">Hasło</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
              <input type="password" value={registerData.password} className="form-control fs-5" onChange={(e) => handleChange(e)}/>
            </div>
          </div>
          <div>
            <label className="fs-5 p-1">Powtórz hasło</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
              <input type="password" value={registerData.passwordCheck} className="form-control fs-5" onChange={(e) => handleChange(e)}/>
            </div>
          </div>
          <div className="d-flex flex-column pt-3">
            <button className="btn btn-primary fs-4 rounded-4">Zarejestruj się</button>
          </div>
        </div>
      </div>
    </div>
  )
}
