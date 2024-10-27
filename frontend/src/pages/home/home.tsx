import { useQuery } from "react-query";
import { getUserById } from "../../services/userService";

export const Home = () => {
  const { data, error } = useQuery(
    "getUser",
    async () => await getUserById(1),
    {
      onSuccess: (res) => console.log(res),
    }
  );
  return <pre>{JSON.stringify(data || error, null, 2)}</pre>;
};
