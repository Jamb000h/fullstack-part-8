import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../mutations";

const LoginForm = ({ show, setToken, setPage, setFavoriteGenre }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN);

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.token.value;
      setToken(token);
      setFavoriteGenre(result.data.login.favoriteGenre)
      localStorage.setItem("bookstore-user-token", token);
      setPage("books")
    }
  }, [result.data]);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
