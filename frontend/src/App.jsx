import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import { useQuery } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState("authors");
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={authors?.data?.allAuthors ?? []} />

      <Books show={page === "books"} books={books?.data?.allBooks ?? []}/>

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
