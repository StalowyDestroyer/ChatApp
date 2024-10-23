import * as yup from "yup";
import { UserFormData } from "../types/types";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Nazwa użytkownika jest wymagana")
    .min(5, "Nazwa uzytkownika musi mieć minimum 5 znaków")
    .max(30, "Nazwa użytkownika musi mieć poniżej 30 znaków"),
  email: yup
    .string()
    .required("Email jest wymagany")
    .email("Podaj poprawny email"),
  password: yup
    .string()
    .required("Hasło jest wymagane")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Hasło musi mieć co najmniej 8 znaków, zawierać jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny"
    )
    .max(100, "Hasło musi mieć poniżej 100 znaków"),
  passwordCheck: yup
    .string()
    .required("Powtórzenie hasła jest wymagane")
    .test("same-password", "Hasła muszą być identyczne", function (value) {
      const { password } = this.parent;
      return password == value;
    }),
});

export const validateUserForRegister = async (data: UserFormData) => {
  try {
    await registerSchema.validate(data, { abortEarly: true });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) console.log(error.errors);
    return false;
  }
};
