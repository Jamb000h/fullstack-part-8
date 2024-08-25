import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import RecommendedBooks from "./components/RecommendedBooks";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import { BOOK_ADDED } from "./subscriptions";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import EditAuthor from "./components/EditAuthor";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [favoriteGenre, setFavoriteGenre] = useState(null);
  const client = useApolloClient();
  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);
  const logout = () => {
    setPage("books");
    setToken(null);
    setFavoriteGenre(null);
    localStorage.clear();
    client.resetStore();
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const newBook = data.data.bookAdded;

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return { allBooks: allBooks.concat(newBook) };
      });
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("recommended")}>recommended</button>
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

      <RecommendedBooks
        show={page === "recommended"}
        books={books?.data?.allBooks ?? []}
        favoriteGenre={favoriteGenre}
      />

      <NewBook show={page === "addBook"} />

      <EditAuthor
        show={page === "editAuthor"}
        authors={authors?.data?.allAuthors ?? []}
      />

      <LoginForm
        show={page === "loginForm"}
        setToken={setToken}
        setPage={setPage}
        setFavoriteGenre={setFavoriteGenre}
      />
    </div>
  );
};

export default App;
