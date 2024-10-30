import * as yup from "yup";
import { ConversationFormData } from "../types/types";

const conversationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Nazwa jest wymagana")
    .min(5, "Nazwa musi mieć conajmniej 5 znaków")
    .max(40, "Nazwa może mieć maksymalnie 40 znaków"),
});

export const validateConversation = async (data: ConversationFormData) => {
  try {
    await conversationSchema.validate(data, { abortEarly: true });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) console.log(error.errors);
    return false;
  }
};
