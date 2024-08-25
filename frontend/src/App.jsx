import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import { useQuery, useApolloClient } from "@apollo/client";
import EditAuthor from "./components/EditAuthor";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient()
  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("addBook")}>add book</button>
            <button onClick={() => setPage("editAuthor")}>edit author</button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && (
          <button onClick={() => setPage("loginForm")}>login form</button>
        )}
      </div>

      <Authors
        show={page === "authors"}
        authors={authors?.data?.allAuthors ?? []}
      />

      <Books show={page === "books"} books={books?.data?.allBooks ?? []} />

      <NewBook show={page === "addBook"} />

      <EditAuthor
        show={page === "editAuthor"}
        authors={authors?.data?.allAuthors ?? []}
      />

      <LoginForm show={page === "loginForm"} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
