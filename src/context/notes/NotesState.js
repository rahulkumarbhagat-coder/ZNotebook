import { useState } from "react";
import NotesContext from "./noteContext";

const NotesState = (props) => {

  const host = "http://localhost:5000"
  const initialNotes = [];

  const [notes, setNotes] = useState(initialNotes);

  //To Get all notes note

  const getNotes = async() => {

    //API call to fetch user

    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });

    const json = await response.json();
    setNotes(json)
  }

  //To add a note

  const addNote = async(title, description, tag) => {

    //API call to fetch user

    const request = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag}),
    });
    

    // const note = {
    //   _id: "6734e73835d1065341d7dbd45",
    //   user: "6730d13cd80518cc62db596b",
    //   title: title,
    //   description: description,
    //   tag: tag,
    //   date: "2024-11-13T17:53:28.939Z",
    //   __v: 0,
    // };
    console.log(request)
    const json = await request.json();
    setNotes(notes.concat(json));
    showAlert("Note added successfully", 'success')
  };

  //To delete a note

  const deleteNote = async(id) => {

    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });

    const note = notes.filter((note)=>{return note._id!==id})
    setNotes(note)
    showAlert("Note deleted successfully", 'success')
  };

  //To edit a note

  const editNote = async(id,title,description,tag) => {

    //API call to fetch user

    const request1 = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title,description,tag }),
    });
    
      const json= await request1.json();
      console.log(json)
    
      //Logic to edit user in frontend

      // const newNote = notes.map((note)=>{
      //   if(note._id=== id){
      //     return{
      //       title: title,
      //       description: description,
      //       tag: tag
      //     }
      //   }
      //   return note
      // })

      let newNote = JSON.parse(JSON.stringify(notes))
    
    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id===id) {
        element.title = title
        element.description = description
        element.tag = tag
        break;
      }
    }
    setNotes(newNote);

    console.log("newNote:", newNote);
    showAlert("Note edited successfully", 'success')
  };

  //To show alert

  const [alert, setAlert] = useState(null)

    const showAlert= (message,type)=> {
        setAlert({
            msg: message,
            type : type
        })
        
        setTimeout(() => {
            setAlert(null)
        }, 1000);
    }
  

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes, alert, showAlert }}>
      {props.children}
    </NotesContext.Provider>
  );
};

export default NotesState;
