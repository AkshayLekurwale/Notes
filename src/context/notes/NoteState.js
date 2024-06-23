import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);

  const getNotes = async () => {
    const url = `${host}/api/notes/fetchallnotes`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error in getnotes! status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json); // This should log the fetched notes
      setNotes(json); // Update state with fetched notes
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async (title, description, tags) => {
    const url = `${host}/api/notes/addnote`; // Correct string interpolation
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tags }),
      });

      const json = await response.json();
      console.log(json);

      setNotes(notes.concat(json));
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  const deleteNote = async (id) => {
    const url = `${host}/api/notes/deletenote/${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
      });

      const json = await response.json();
      console.log(json);

      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
      props.showAlert("Deleted successfuly", "success");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  const editNote = async (id, title, description, tags) => {
    const url = `${host}/api/notes/updatenote/${id}`; // Correct string interpolation
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tags }),
      });

      const json = await response.json();
      console.log(json);

      const newNotes = notes.map(note =>
        note._id === id ? { ...note, title, description, tags } : note
      );
      setNotes(newNotes);
    } catch (error) {
      console.error("Error editing note:", error);
    }
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
}

export default NoteState;
