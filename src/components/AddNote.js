import React, { useContext, useState } from "react";
import notesContext from "../context/notes/noteContext";

const AddNote = () => {
  const context = useContext(notesContext);
  const { addNote } = context;

  const [notes, setNotes] = useState({title:"",description:"",tag:""})

  const handleClick = (e) => {
    e.preventDefault();
    addNote(notes.title,notes.description,notes.tag);
    setNotes({title:"",description:"",tag:""})
  };

  const onChange = (e) => {
    setNotes({...notes, [e.target.name]:e.target.value})
  };

  return (
    <div>
      <div className="container my-3">
        <h2>New Note</h2>
        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              value={notes.title}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={notes.description}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              value={notes.tag}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          
          <button
            disabled={notes.title.length<5 || notes.description.length<5}
            type="submit"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Submit 
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
