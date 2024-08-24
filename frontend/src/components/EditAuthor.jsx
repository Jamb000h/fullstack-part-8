import { useState } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_AUTHOR } from "../mutations";
import { ALL_AUTHORS } from "../queries";

const EditAuthor = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    editAuthor({
      variables: {
        name,
        setBornTo: parseInt(born)
      },
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>Edit author</h2>
      <h3>Set birth year</h3>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Set birth year</button>
      </form>
    </div>
  );
};

export default EditAuthor;
