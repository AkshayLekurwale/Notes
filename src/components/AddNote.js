import React, { useContext, useState } from 'react';
import NoteContext from '../context/notes/NoteContext';

const AddNote = (props) => {
    const context = useContext(NoteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tags: "" });

    const handleClick = (e) => {
        e.preventDefault();
        if (note.title.trim() === "" || note.description.trim() === "") {
            props.showAlert("Please enter both title and description", "danger");
        } else {
            addNote(note.title, note.description, note.tags);
            setNote({ title: "", description: "", tags: "" });
            props.showAlert("Note added successfully", "success");
        }
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <h5 className="card-header bg-primary text-white">Add a Note</h5>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={note.title}
                                onChange={onChange}
                                placeholder="Enter Title"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={note.description}
                                onChange={onChange}
                                placeholder="Description"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="tags"
                                name="tags"
                                value={note.tags}
                                onChange={onChange}
                                placeholder="Enter tags"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleClick}
                        >
                            Add Note
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNote;
