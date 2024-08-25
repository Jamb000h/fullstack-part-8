import {useState} from "react"

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState("all genres")
  if (!props.show) {
    return null
  }

  const genres = new Set(props.books.flatMap(book => book.genres))

  const books = selectedGenre === "all genres" ? props.books : props.books.filter(book => book.genres.includes(selectedGenre))

  return (
    <div>
      <h2>books</h2>
      {selectedGenre !== "all genres" && (
        <p>in genre <strong>{selectedGenre}</strong></p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {Array.from(genres).map(genre => {
        return <button onClick={() => setSelectedGenre(genre)}>{genre}</button>
      })}
      <button onClick={() => setSelectedGenre("all genres")}>all genres</button>
    </div>
  )
}

export default Books
