import React, { useContext } from "react";
import notesContext from "../context/notes/noteContext";

const NoteItem = (props) => {
  const { note,updateNote } = props;
  const context = useContext(notesContext);
  const { deleteNote } = context;

  return (
    <div className="col-md-3">
      
      <div className="card my-3">

        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id)}}></i>
          <i className="fa-solid fa-file-pen mx-2" onClick={()=>{updateNote(note)}}></i>
        </div>
        
      </div>

    </div>
  );
};

export default NoteItem;
