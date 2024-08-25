const RecommendedBooks = (props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>

      <p>
        in your favorite genre <strong>{props.favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books
            .filter((book) => book.genres.includes(props.favoriteGenre))
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBooks;
