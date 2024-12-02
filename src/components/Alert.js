import React, { useContext } from 'react'
import notesContext from '../context/notes/noteContext';

export default function Alert(props) {

  const context = useContext(notesContext);
  const { alert } = context;


    const capatalize = (word) =>{
      if(word==='danger'){
        word= "error"
      }
        const lower = word
        return lower.charAt(0).toUpperCase() + lower.slice(1)
    }

  return (
   <div style={{height:'50px'}}>
     {alert && <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
  <strong>{capatalize(alert.type)}</strong>:{alert.msg}
  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>}
   </div>
  )
}
