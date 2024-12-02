import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import notesContext from "../context/notes/noteContext";


const Signup = () => {

  //alerts context api
  const context = useContext(notesContext);
  const { showAlert } = context;

  //defining useNavigation
  let navigate = useNavigate();

  //defining credentials
  const[credentials, setCredentials] = useState({name:"", email:"", password:"",cpassword:""})


  //defining onChange
  const onChange = (e) => {
    setCredentials({...credentials, [e.target.name]:e.target.value})
  };

  //defining onClick
  const handleClick = async(e)=>{
    e.preventDefault();
    const {name,email,password} = credentials

    const request1 = await fetch('http://localhost:5000/api/auth/createuser', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, email, password})
    });
    
      const json= await request1.json();
      console.log(json)
      if(json.success){
         //Redirect
        localStorage.setItem('token', json.authtoken);
        navigate("/")
        showAlert("Successfully created account" , "success")
      }
       else{
        showAlert("Invalid Credentials" , "danger")
       }

      
  }

  return (
    <div className="container">
      <form onSubmit={handleClick}>
      <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="emailHelp"
            value={credentials.name}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            value={credentials.email}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="password"
            onChange={onChange}
            value={credentials.password}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="cpassword"
            className="form-control"
            id="cpassword"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
